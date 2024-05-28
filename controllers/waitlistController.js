import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
import { validationResult } from 'express-validator';

const waitlistId = process.env.WAITLIST_ID;
const referralLink = process.env.WAITLIST_URL;

export const signupToWaitlist = async (req, res) => {
    // Prende l'email dell'utente
    const { email } = req.body;
    // Verifica che l'email sia valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const response = await fetch("https://api.getwaitlist.com/api/v1/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                waitlist_id: waitlistId,
                referral_link: referralLink,
            }),
        });
        // Verifica se ci siano errori di qualche tipo nella chiamata
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "An error occurred while signing up to the waitlist.");
        }
        // Se non ci sono errori restituisce il codice di successo 200
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        // Errore impresto
        console.error("Signup to Waitlist Error:", error);
        return res.status(500).json({ error: error.message || "An error occurred" });
    }
};
