import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { body, validationResult } from 'express-validator';
import { Resend } from 'resend';
import fs from 'fs/promises';
import sanitizeHtml from 'sanitize-html';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Legge il contenuto del file HTML di template
        const htmlContent = await fs.readFile('./file/emailTemplate.html', 'utf-8');
        // Pulisce il contenuto HTML
        const cleanHtml = sanitizeHtml(htmlContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags,
            allowedAttributes: sanitizeHtml.defaults.allowedAttributes
        });
        // Invio dell'email
        const { data, error } = await resend.emails.send({
            from: "Describify <info@describify.it>",
            to: email,
            subject: "Benvenuto in Describify",
            html: cleanHtml,
        });
        if (error) {
            return res.status(400).json({ error });
        }
        return res.status(200).json({ data });
    } catch (error) {
        console.error("OpenAI Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
