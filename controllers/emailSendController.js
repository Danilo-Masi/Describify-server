import { Resend } from 'resend';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Inizializzazione dell'API di Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Messaggi di errore e successo predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const RESEND_ERROR_MESSAGE = 'Errore durante invio email tramite Resend';
const SUCCESS_MESSAGE = 'Email inviata con successo';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const sendEmail = async (req, res) => {
    try {
        const { emailReciver, emailSubject, email } = req.body;

        // Controllo dei dati di input
        if (!email || emailReciver === "" || emailSubject === "") {
            console.error('BACKEND: Il campo emailReciver/subject/email è mancante');
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Il campo emailReciver/subject/email è mancante' });
        }

        // Invio dell'email tramite Resend
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: emailReciver,
            subject: emailSubject,
            html: email,
        });

        // Gestione degli errori specifici di Resend
        if (error) {
            console.error('BACKEND: Errore da Resend:', error.message);
            return res.status(401).json({ error: RESEND_ERROR_MESSAGE, details: error.message });
        }

        // Risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, data });
    } catch (error) {
        // Gestione degli errori imprevisti
        console.error('BACKEND: Errore imprevisto durante invio email', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};