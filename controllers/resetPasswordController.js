import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const SUPABASE_RATE_LIMIT_ERROR_MESSAGE = 'Errore di superamento limite di richieste di reset della password';
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di aggiornamento dei dati';
const SUCCESS_MESSAGE = 'Profilo utente aggiornato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const resetPasswordController = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { email } = req.body;
    // Verifica che i dati della richiesta non siano campi vuoti
    if (!email) {
        console.error('BACKEND: Email e/o nuova password mancante');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Email non presente' });
    }
    // Verifica che l'email sia un'email valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.array());
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.array() });
    }
    try {
        // Funzione per effettuare il reset della password dimenticata
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://127.0.0.1:5173/reset-password'
        });
        // Verifica che non ci siano eventuali errori specifici di Supabase
        if (error) {
            console.error('BACKEND: Errore da Supabase:', error.message);
            if (error.code === 'over_email_send_rate_limit') {
                return res.status(429).json({ error: SUPABASE_RATE_LIMIT_ERROR_MESSAGE, details: error.message });
            }
            return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: error.message });
        }
        // Invia una risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, data });
    } catch (error) {
        // Invia una risposta di errore imprevisto
        console.error('BACKEND: Errore imprevisto durante aggiornamento profilo utente', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};