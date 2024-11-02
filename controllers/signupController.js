import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi di errore/successo
const MESSAGES = {
    VALIDATION_ERROR_MESSAGE: 'Valori della richiesta non validi',
    SUPABASE_ERROR_MESSAGE: 'Errore nella fase di registrazione',
    DB_ERROR_MESSAGE: 'Errore durante l\'insrimento dell\'utente nella tabella del DB di Supabase',
    SERVER_ERROR_MESSAGE: 'Errore del server',
    SUCCESS_MESSAGE: 'Registrazione effettuata correttamente',
};

export const signupController = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { name, email, password } = req.body;

    // Verifica che i dati della richiesta non siano campi vuoti
    if (!name || !email || !password) {
        console.error('BACKEND: Name, email o password mancanti');
        return res.status(400).json({ error: MESSAGES.VALIDATION_ERROR_MESSAGE });
    }

    // Verifica che l'email sia un'email valida
    const errors = validationResult(req.body.email);
    if (!errors.isEmpty()) {
        console.error('BACKEND: Errori di validazione:', errors.message);
        return res.status(400).json({ error: MESSAGES.VALIDATION_ERROR_MESSAGE });
    }

    try {
        // Effettua il signup con Supabase Auth
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
            return res.status(401).json({ error: MESSAGES.SUPABASE_ERROR_MESSAGE });
        }

        // Inserisce il nuovo utente nella tabella 'users'
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
            return res.status(500).json({ error: MESSAGES.DB_ERROR_MESSAGE });
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
        // Gestisce gli errori
        console.error('BACKEND: Errore imprevisto durante la fase di registrazione', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR_MESSAGE });
    }
};