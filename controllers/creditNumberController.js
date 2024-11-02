import supabase from '../config/supabase.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Messaggi di errore
const MESSAGES = {
    TOKEN_ERROR: 'Token mancante o non valido',
    SERVER_ERROR: 'Errore del server',
    NO_USER_ERROR: 'Nessun utente trovato con questo ID',
    SUPABASE_ERROR: 'Errore durante la lettura dei dati dal DB di Supabse',
};

export const getCreditsNumber = async (req, res) => {

    // Estrai il token JWT dall'header di autorizzazione
    const token = req.headers.authorization?.split(' ')[1];

    // Verifica che non ci sia nessun errore nel token passato nell'header della richiesta
    if (!token) {
        console.error('BACKEND: Token mancante o non valido');
        return res.status(401).json({ error: MESSAGES.TOKEN_ERROR });
    }

    try {
        // Decodifica ed estrae l'ID dell'utente dal JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Funzione SQL per prelevare il "numero_crediti" dal DB di Supabase
        const { data, error: userError } = await supabase
            .from('users')
            .select('numero_crediti')
            .eq('id', decoded.id);

        // Verifica che non ci siano errori generici
        if (userError) {
            console.error('BACKEND: Errore nel recupero dei dati:', userError.message);
            return res.status(500).json({ error: MESSAGES.SERVER_ERROR });
        }

        // Verifica che sia presente un utente con l'ID specificato
        if (!data || data.length === 0) {
            console.error('BACKEND: Nessun utente trovato con questo ID');
            return res.status(404).json({ error: MESSAGES.NO_USER_ERROR });
        }

        // In caso di successo restituisce il numero di crediti prelevati dal DB
        if (data && data.length > 0) {
            res.json({ numero_crediti: data[0].numero_crediti });
        }

    } catch (error) {
        // Gestione degli errori
        console.error('BACKEND: Errore durante la lettura dei dati dal DB di Supabse', error.message);
        return res.status(500).json({ error: MESSAGES.SUPABASE_ERROR });
    }
}