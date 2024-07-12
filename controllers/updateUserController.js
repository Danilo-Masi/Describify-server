import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

// Messaggi predefiniti
const SUCCESS_MESSAGE = 'Profilo utente aggiornato correttamente';
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di aggiornamento dei dati';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const updateUserController = async (req, res) => {
    // Preleva i dati inviati dal frontend nel body
    const { email, newPassword } = req.body;
    // Verifica che email e password non siano campi vuoti
    if (!email || !newPassword) {
        console.error('BACKEND: Email e/o nuova password mancante');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Email e nuova password non sono presenti' });
    }
    // Verifica che l'email sia un'email valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.array());
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.array() });
    }
    try {
        // Funzione per aggiornare i dati del profilo utente
        const { data, error } = await supabase.auth.updateUser({ email, password: newPassword });
        // Verifica che non ci siano errori nell'aggiornamento del profilo utente
        if (error) {
            console.error('BACKEND: Errore da Supabase:', error.message);
            return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: error.message });
        }
        // Invia una risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, data });
    } catch (error) {
        // Invia una risposta di errore
        console.error('BACKEND: Errore imprevisto durante aggiornamento profilo utente', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
}