import openai from '../config/openai.js';
import dotenv from 'dotenv';
import supabase from '../config/supabase.js';
import jwt from 'jsonwebtoken';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const OPEN_AI_ERROR_MESSAGE = 'Errore nella fase di generazione della caption';
const CREDITS_ERROR_MESSAGE = 'Crediti insufficienti';
const SUCCESS_MESSAGE = 'Caption generata correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const productGeneration = async (req, res) => {
    try {
        // Estrai il token JWT dall'header di autorizzazione
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token mancante o non valido' });
        }

        console.log('TOKEN: ', token); //LOG

        // Decodifica il token per ottenere l'userId
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodeToken.id;

        console.log('USER ID: ', userId); //LOG

        // Preleva i dati presenti nel body della richiesta
        const { prompt } = req.body;

        // Verifica che i dati della richiesta non siano campi vuoti
        if (!prompt) {
            console.error('BACKEND: Prompt e/o plan mancante');
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Prompt mancante' });
        }

        // Preleva il numero di token dalla tabella users nel DB di supabase
        const { data, error: userError } = await supabase
            .from('users')
            .select('numero_crediti')
            .eq('id', userId);

        if (userError) {
            console.error('Errore nel recupero dei dati:', userError);
        } else if (data.length > 0) {
            console.log('ID prelevato', data[0].id); // Accesso al primo oggetto nell'array
            console.log('Token prelevati', data[0].numero_crediti); // Accesso al numero di crediti
        } else {
            console.log('Nessun utente trovato con questo ID.');
        }

        // Controlla se l'utente ha abbastanza crediti
        if (data.numero_crediti <= 0) {
            console.error('BACKEND: Crediti insufficienti', userError.message);
            return res.status(403).json({ error: CREDITS_ERROR_MESSAGE, details: 'Crediti insufficienti' });
        }

        // Funzione per la generazione del contenuto
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "assistant",
                content: `Crea un titolo accattivante e una descrizione efficace per vendere un articolo di seconda mano su piattaforme come Vinted, Subito o eBay. Le caratteristiche del prodotto sono: ${prompt}. Il titolo deve essere breve (massimo 10 parole) e iniziare con un'emoji che rappresenti l'articolo. 
                            La descrizione deve seguire questa struttura:
                                1. Introduzione: Una breve frase che attiri l'attenzione, evidenziando il design e l'utilizzo dell'articolo.
                                2. Caratteristiche principali: Includi una lista con emoji (ad esempio "🌟 Caratteristiche principali:") che elenca taglia, colore, materiale, condizioni e altre caratteristiche importanti.
                                3. Motivi per acquistare: Spiega perché l'articolo è un ottimo affare, usando una sezione introdotta da un'emoji (ad esempio "🔹 Perché scegliere questo prodotto?"). Enfatizza il prezzo competitivo, le condizioni, e la qualità dell'articolo.
                                4. Invito all'azione: Termina con un messaggio che inviti l'acquirente a contattarti per ulteriori dettagli o per provare il prodotto, ad esempio "📞 Contattami per maggiori dettagli o per organizzare una prova."
                            Assicurati di mantenere il testo sotto le 150 parole, rendendo il tutto personale e coinvolgente. Come cosa importante ricoda di delineare il titolo con Titolo: e la descrizione con Descrizione: senza mettere **`
            }],
            max_tokens: 200,
            temperature: 0.6,
            top_p: 0.9,
        });

        // Verifica che non ci siano eventuali errori specifici di OpenAI
        if (!response.choices || response.choices.length === 0) {
            console.error('BACKEND: Nessuna risposta da OpenAI');
            return res.status(500).json({ error: OPEN_AI_ERROR_MESSAGE, details: 'No valid response from OpenAI' });
        }
        // Estrarre titolo e descrizione dalla risposta
        const responseText = response.choices[0].message.content;
        const titleStart = responseText.indexOf('Titolo: ') + 'Titolo: '.length;
        const descriptionStart = responseText.indexOf('Descrizione: ');
        const title = responseText.slice(titleStart, descriptionStart).trim();
        const description = responseText.slice(descriptionStart + 'Descrizione: '.length).trim();

        // Diminuisci di 1 il numero di crediti dell'utente
        const { error: updateError } = await supabase
            .from('users')
            .update({ numero_crediti: user.numero_crediti - 1 })
            .eq('id', userId);

        // Verifica eventuali errori nell'aggiornamento dei crediti
        if (updateError) {
            console.error('BACKEND: Errore nel diminuire i crediti', updateError.message);
            return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: 'Errore nel diminuire i crediti' });
        }

        // Invia una risposta di successo con titolo e descrizione
        return res.json({ message: SUCCESS_MESSAGE, title, description });
    } catch (error) {
        // Gestione degli errori
        console.error('BACKEND: Errore imprevisto durante la generazione della caption', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};
