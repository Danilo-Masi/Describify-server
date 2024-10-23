import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Valori della richiesta non validi';
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di registrazione';
const SUCCESS_MESSAGE = 'Registrazione effettuata correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const signupController = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { name, email, password } = req.body;
    // Verifica che i dati della richiesta non siano campi vuoti
    if (!name || !email || !password) {
        console.error('BACKEND: Name, email o password mancanti');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.message });
    }
    // Verifica che l'email sia un'email valida
    const errors = validationResult(req.body.email);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.array());
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: error.message });
    }
    try {
        // 1. Effettua il signup con Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });
        // Verifica che non ci siano eventuali errori specifici di Supabase Auth
        if (authError) {
            console.error('BACKEND: Errore da Supabase:', authError.message);
            return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: authError.message });
        }
        // 2. Inserisce il nuovo utente nella tabella 'users'
        const { user } = data;
        const { error: dbError } = await supabase
            .from('users')
            .insert([
                {
                    id: user.id,
                    email: user.email,
                    name: user.app_metadata.name,
                    numero_crediti: 0
                }
            ]);
        // Verifica che non ci siano eventuali errori specifici di Supabase DB
        if (dbError) {
            console.error('BACKEND: Errore durante l\'inserimento nella tabella users:', dbError.message);
            return res.status(500).json({ error: 'Database insertion error', details: dbError.message });
        }
        // 3. Genera il token JWT
        const token = jwt.sign(
            { id: data.user.id, email: data.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Invia una risposta di successo
        return res.status(200).json({ message: SUCCESS_MESSAGE, token });
    } catch (error) {
        // Invia una risposta di errore imprevisto
        console.error('BACKEND: Errore imprevisto durante la fase di registrazione', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};