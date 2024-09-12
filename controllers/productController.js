import openai from '../config/openai.js';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const OPEN_AI_ERROR_MESSAGE = 'Errore nella fase di generazione della caption';
const SUCCESS_MESSAGE = 'Caption generata correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const productGeneration = async (req, res) => {
    try {
        // Preleva i dati presenti nel body della richiesta
        const { prompt } = req.body;
        // Verifica che i dati della richiesta non siano campi vuoti
        if (!prompt) {
            console.error('BACKEND: Prompt e/o plan mancante');
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Prompt mancante' });
        }
        // Funzione per la generazione del contenuto
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "assistant",
                content: `Descrivi brevemente e convincentemente un articolo di seconda mano per la vendita online con queste caratteristiche: ${prompt}. Metti in luce i vantaggi e lo stato dell'oggetto per attirare acquirenti su piattaforme come Vinted, Subito, eBay. Limite di parole: massimo 50.`
            }],
            max_tokens: 200,
            temperature: 0.5,
            top_p: 1,
        });
        // Verifica che non ci siano eventuali errori specifici di OpenAI
        if (!response.choices || response.choices.length === 0) {
            console.error('BACKEND: Nessuna risposta da OpenAI');
            return res.status(500).json({ error: OPEN_AI_ERROR_MESSAGE, details: 'No valid response from OpenAI' });
        }
        // Invia una risposta di successo
        return res.json({ message: SUCCESS_MESSAGE, description: response.choices[0].message.content });
    } catch (error) {
        // Errore impresto
        console.error('BACKEND: Errore imprevisto durante la generazione della caption', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};
