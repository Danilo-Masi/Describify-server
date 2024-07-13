import fetch from 'node-fetch';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Variabili d'ambiente
const waitlistId = process.env.WAITLIST_ID;
const referralLink = process.env.WAITLIST_URL;

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Valori della richiesta non validi';
const WAITLIST_ERROR_MESSAGE = 'Errore durante la fase di registrazione alla waitlist';
const SUCCESS_MESSAGE = 'Registrazione alla waitlist effettuata correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const signupToWaitlist = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { email } = req.body;
    // Verifica che i dati della richiesta non siano campi vuoti
    if (!email) {
        console.error('BACKEND: email mancante');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.message });
    }
    // Verifica che l'email sia un'email valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.array());
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.array() });
    }
    try {
        // Funzione per registrare un nuovo utente alla waitlist
        const response = await fetch("https://api.getwaitlist.com/api/v1/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                waitlist_id: waitlistId,
                referral_link: referralLink,
            }),
        });
        // Verifica che non ci siano eventuali errori specifici di Waitlist
        if (!response.ok) {
            console.error('BACKEND: Errore da Waitlist:', error.message);
            return res.status(401).json({ error: WAITLIST_ERROR_MESSAGE, details: error.message });
        }
        // Invia una risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, data });
    } catch (error) {
        // Errore impresto
        console.error('BACKEND: Errore imprevisto durante la registrazione alla waitlist', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};
