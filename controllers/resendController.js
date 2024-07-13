import { validationResult } from 'express-validator';
import { Resend } from 'resend';
import fs from 'fs/promises';
import sanitizeHtml from 'sanitize-html';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Variabili d'ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const RESEND_ERROR_MESSAGE = 'Errore durante invio email tramite Resend';
const SUCCESS_MESSAGE = 'Profilo utente aggiornato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const sendEmail = async (req, res) => {
    try {
        // Preleva i dati presenti nel body della richiesta
        const { email, language } = req.body;
        // Verifica che i dati della richiesta non siano campi vuoti
        if (!email || !language) {
            console.error('BACKEND: Email e/o language mancante');
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Email e/o language mancante' });
        }
        // Verifica che l'email sia un'email valida
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('BACKEND: Errori di validazione:', errors.array());
            return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.array() });
        }
        // Determina il template da usare in base alla lingua passata
        const templateFile = language === 'it' ? process.cwd() + '/file/emailTemplate_it.html' : process.cwd() + '/file/emailTemplate_en.html';
        // Legge il contenuto del file Html che contiene il template dell'email
        const htmlContent = await fs.readFile(templateFile, 'utf-8');
        // Pulisce il contenuto del file HTML di template
        const cleanHtml = sanitizeHtml(htmlContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags, // Estende i tag permessi per includere il tag "style"
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes, // Estende gli attributi permessi per includere gli stili inline su tutti gli elementi
                '*': ['style']
            }
        });
        // Funzione per l'invio dell'email
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: email,
            subject: language === 'it' ? "Benvenuto in Describify" : 'Welcome to Describify',
            html: cleanHtml,
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

