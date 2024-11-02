import openai from '../config/openai.js';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi di errore/successo
const MESSAGES = {
    VALIDATION_ERROR_MESSAGE: 'Errore di validazione',
    OPEN_AI_ERROR_MESSAGE: 'Errore nella fase di generazione della caption',
    SERVER_ERROR_MESSAGE: 'Errore del server',
    SUCCESS_MESSAGE: 'Caption generata correttamente',
};

export const productGeneration = async (req, res) => {
    try {
        // Preleva i dati presenti nel body della richiesta
        const { prompt } = req.body;

        // Verifica che i dati della richiesta siano validi
        if (!prompt) {
            console.error('BACKEND: Prompt mancante');
            return res.status(400).json({ error: MESSAGES.VALIDATION_ERROR_MESSAGE });
        }

        // Genera il contenuto tramite l'API di OPENAI
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
            return res.status(500).json({ error: MESSAGES.OPEN_AI_ERROR_MESSAGE });
        }

        // Estre titolo e descrizione dalla risposta
        const responseText = response.choices[0].message.content;
        const titleStart = responseText.indexOf('Titolo: ') + 'Titolo: '.length;
        const descriptionStart = responseText.indexOf('Descrizione: ');
        const title = responseText.slice(titleStart, descriptionStart).trim();
        const description = responseText.slice(descriptionStart + 'Descrizione: '.length).trim();

        // Invia una risposta di successo con titolo e descrizione
        return res.json({ message: MESSAGES.SUCCESS_MESSAGE, title, description });
        
    } catch (error) {
        // Gestione degli errori
        console.error('BACKEND: Errore imprevisto durante la generazione della caption', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR_MESSAGE });
    }
};
