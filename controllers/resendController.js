import dotenv from 'dotenv';
dotenv.config();
import { validationResult } from 'express-validator';
import { Resend } from 'resend';
import fs from 'fs/promises';
import sanitizeHtml from 'sanitize-html';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req, res) => {
    // Prende l'email dell'utente
    const { email } = req.body;
    // Verifica che l'email sia valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Legge il contenuto del file HTML di template
        const htmlContent = await fs.readFile('./file/emailTemplate.html', 'utf-8');
        // Pulisce il contenuto del file HTML di template
        const cleanHtml = sanitizeHtml(htmlContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags, //Estende i tag permessi per includere il tag "style"
            allowedAttributes: { //Estende gli attributi permessi per includere gli stili inline su tutti gli elementi 
                ...sanitizeHtml.defaults.allowedAttributes,
                '*': ['style']
            }
        });
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: email,
            subject: "Benvenuto in Describify",
            html: cleanHtml,
        });
        // Verifica se ci siano errori di qualche tipo nella chiamata
        if (error) {
            return res.status(400).json({ error });
        }
        // Se non ci sono errori restituisce il codice di successo 200
        return res.status(200).json({ data });
    } catch (error) {
        // Errore imprevisto
        console.error("OpenAI Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
