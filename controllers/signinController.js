import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Valori della richiesta non validi';
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di accesso';
const SUCCESS_MESSAGE = 'Accesso effettuato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const signinController = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { email, password } = req.body;
    // Verifica che i dati della richiesta non siano campi vuoti
    if (!email || !password) {
        console.error('BACKEND: Email o password mancanti');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.message });
    }
    // Verifica che l'email sia un'email valida
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.array());
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.array() });
    }
    try {
        // Funzione per effettuare l'accesso
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        // Verifica che non ci siano eventuali errori specifici di Supabase
        if (error) {
            console.error('BACKEND: Errore da Supabase:', error.message);
            return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: error.message });
        }
        // Genera il token JWT
        const token = jwt.sign(
            { id: data.user.id, email: data.user.email }, //Payload del token
            process.env.JWT_SECRET, //Chiave segreta per firmare il token
            { expiresIn: '1h' } //Tempo di scadenza del token
        );
        // Invia una risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, token });
    } catch (error) {
        // Invia una risposta di errore imprevisto
        console.error('BACKEND: Errore imprevisto durante la fase di accesso', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};
