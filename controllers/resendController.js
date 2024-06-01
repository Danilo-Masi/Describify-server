import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { Resend } from 'resend';
import fs from 'fs/promises';
import sanitizeHtml from 'sanitize-html';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req, res) => {
    try {
        // Prende l'email e la lingua dalla request body
        const { email, language } = req.body;

        // Verifica che l'email sia valida
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Determina il template da usare in base alla lingua
        const templateFile = language === 'it' ? process.cwd() + '/file/emailTemplate_it.html' : process.cwd() + '/file/emailTemplate_en.html';

        // Legge il contenuto del file Html
        const htmlContent = await fs.readFile(templateFile, 'utf-8');

        // Pulisce il contenuto del file HTML di template
        const cleanHtml = sanitizeHtml(htmlContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags, // Estende i tag permessi per includere il tag "style"
            allowedAttributes: { // Estende gli attributi permessi per includere gli stili inline su tutti gli elementi 
                ...sanitizeHtml.defaults.allowedAttributes,
                '*': ['style']
            }
        });

        // Invia l'email utilizzando il servizio Resend
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: email,
            subject: language === 'it' ? "Benvenuto in Describify" : 'Welcome to Describify',
            html: cleanHtml,
        });

        // Verifica se ci sono errori nella chiamata
        if (error) {
            console.error("Error in email sending:", error);
            return res.status(400).json({ error: error.message });
        }

        // Invio email riuscito
        return res.status(200).json({ data });
    } catch (error) {
        // Se si verifica un errore, stampa lo stack di errore completo
        console.error("Unexpected error:", error.stack);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

