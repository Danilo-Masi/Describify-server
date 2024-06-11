import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

export const signupController = async (req, res) => {

    // Prende email e password dal client
    const { email, password } = req.body;

    // Verifica che l'email sia valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Funzione per la creazione di un nuovo utente
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'https://www.describify.it'
            }
        })

        // Verifica che l'utente sia presente
        if (error) {
            return res.status(401).json({ error: 'Credenziali non valide.' });
        }

        // Invia una risposta di successo
        res.status(200).json({ message: 'Login effettuato con successo.', data });
    } catch (error) {
        console.error('Errore durante la fase di signin', error.message);
        res.status(500).json({ error: 'Errore del server. Riprova più tardi.' });
    }
};