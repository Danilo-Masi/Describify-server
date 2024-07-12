import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

export const resetPasswordController = async (req, res) => {
    // Prende l'email dal client
    const { email } = req.body;
    console.log('Email ricevuta per reset password', email); // Log dell'email

    // Verifica che l'email sia valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Funzione per effettuare il reset della password dimenticata
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);

        // Verifica che l'utente sia presente nel DB
        if (error) {
            console.error('Errore da Subapase: ', error.message); // Log dell'errore specifico di Supabase
            if (error.code === 'over_email_send_rate_limit') {
                return res.status(429).json({ error: 'Hai superato il limite di richieste di reset della password. Riprova più tardi' });
            }
            return res.status(401).json({ error: 'Errore nella fase di reset della password', details: error.message });
        }

        // Invia una risposta di successo
        return res.status(200).json({ message: 'Email per il reset della password inviata con successo', data });
    } catch (error) {
        console.error('Errore durante la fase di reset della password', error.message);
        return res.status(500).json({ error: 'Errore del server. Riprova più tardi.' });
    }
};