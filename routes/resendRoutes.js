import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { body, validationResult } from 'express-validator';
import { Resend } from 'resend';

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send-email",
    body('email').trim(),
    async (req, res) => {
        /* La validazione è commentata, ma qui è come riattivarla se necessario
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        */
        const { email } = req.body;
        try {
            const { data, error } = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: email,
                subject: "hello world",
                html: "<strong>it works!</strong>",
            });
            if (error) {
                return res.status(400).json({ error });
            }
            res.status(200).json({ data });
        } catch (error) {
            console.error("OpenAI Error:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
);

export default router;
