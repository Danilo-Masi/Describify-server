import { Resend } from 'resend';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Inizializzazione dell'API di Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Messaggi di errore/successo
const MESSAGES = {
    VALIDATION_ERROR_MESSAGE: 'Errore di validazione',
    RESEND_ERROR_MESSAGE: 'Errore durante invio email tramite Resend',
    SERVER_ERROR_MESSAGE: 'Errore del server',
    SUCCESS_MESSAGE: 'Email inviata con successo',
};

export const sendEmail = async (req, res) => {
    try {

        // Contenuto del body della richiesta
        const { emailReciver, emailSubject, email } = req.body;

        // Verifica che i dati passati nel body della richiesta siano validi
        if (!email || emailReciver === "" || emailSubject === "") {
            console.error('BACKEND: Il campo emailReciver/subject/email è mancante');
            return res.status(400).json({ error: MESSAGES.VALIDATION_ERROR_MESSAGE });
        }

        // Invio dell'email tramite l'API di Resend
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: emailReciver,
            subject: emailSubject,
            html: email,
        });

        // Gestione degli errori specifici di Resend
        if (error) {
            console.error('BACKEND: Errore da Resend:', error.message);
            return res.status(401).json({ error: MESSAGES.RESEND_ERROR_MESSAGE });
        }

        // Risposta di successo
        return res.status(200).json({ message: MESSAGES.SUCCESS_MESSAGE, data });

    } catch (error) {
        // Gestione degli errori
        console.error('BACKEND: Errore imprevisto durante invio email', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR_MESSAGE });
    }
};