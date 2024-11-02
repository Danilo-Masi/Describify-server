import fetch from 'node-fetch';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Variabili d'ambiente
const waitlistId = process.env.WAITLIST_ID;
const referralLink = process.env.WAITLIST_URL;

// Messaggi di errore/successo
const MESSAGES = {
    VALIDATION_ERROR_MESSAGE: 'Valori della richiesta non validi',
    WAITLIST_ERROR_MESSAGE: 'Errore durante la fase di registrazione alla waitlist',
    SERVER_ERROR_MESSAGE: 'Errore del server',
    SUCCESS_MESSAGE: 'Registrazione alla waitlist effettuata correttamente',
};

export const signupToWaitlist = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { email } = req.body;

    // Verifica che i dati della richiesta non siano campi vuoti
    if (!email) {
        console.error('BACKEND: email mancante o non valida');
        return res.status(400).json({ error: MESSAGES.VALIDATION_ERROR_MESSAGE });
    }

    // Verifica che l'email sia un'email valida
    const errors = validationResult(req.body.email);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.message);
        return res.status(400).json({ error: MESSAGES.VALIDATION_ERROR_MESSAGE });
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
            const errorData = await response.json(); // Estrai il body di risposta in caso di errore
            console.error('BACKEND: Errore da Waitlist:', errorData);
            return res.status(401).json({ error: MESSAGES.WAITLIST_ERROR_MESSAGE });
        }

        // Estrai il body di successo dalla risposta
        const responseData = await response.json();

        // Invia una risposta di successo
        return res.status(200).json({ message: MESSAGES.SUCCESS_MESSAGE, data: responseData });

    } catch (error) {
        // Gestione degli errori
        console.error('BACKEND: Errore imprevisto durante la registrazione alla waitlist', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR_MESSAGE });
    }
};
