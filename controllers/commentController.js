import { validationResult } from 'express-validator';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Variabili d'ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const RESEND_ERROR_MESSAGE = 'Errore durante invio email tramite Resend';
const SUCCESS_MESSAGE = 'Commento inviato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const sendComment = async (req, res) => {
    try {
        // Preleva i dati presenti nel body della richiesta
        const { message } = req.body;
        // Verifica che i dati della richiesta non siano campi vuoti
        if (!message) {
            console.error('BACKEND: Message mancante');
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Message mancante' });
        }
        // Verifica che l'email sia un'email valida
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('BACKEND: Errori di validazione:', errors.array());
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.array() });
        }
        // Funzione per l'invio dell'email
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: ["danilomasi999@gmail.com"],
            subject: "Utente segnala errore",
            html: "<p>{message}</p>",
        });
        // Verifica che non ci siano eventuali errori specifici di Resend
        if (error) {
            console.error('BACKEND: Errore da Resend:', error.message);
            return res.status(401).json({ error: RESEND_ERROR_MESSAGE, details: error.message });
        }
        // Invia una risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, data });
    } catch (error) {
        // Invia una risposta di errore imprevisto
        console.error('BACKEND: Errore imprevisto durante invio email tramite Resend', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
}

