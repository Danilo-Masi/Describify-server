import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

export const resetPasswordController = async (req, res) => {
    // Prende l'email dal client
    const { email } = req.body;

    // Verifica che l'email sia valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Funzione per effettuare il resend della passoword dimenticata
        let { data, error } = await supabase.auth.resetPasswordForEmail(email)

        // Verifica che l'utente sia presente nel DB
        if (error) {
            return res.status(401).json({ error: 'Credenziali non valide.' });
        }

        // Invia una risposta di successo
        res.status(200).json({ message: 'Password dimenticata reinviata con successo', data });
    } catch (error) {
        console.error('Errore durante la fase di reset della password', error.message);
        res.status(500).json({ error: 'Errore del server. Riprova più tardi.' });
    }
};
