import supabase from '../config/supabase.js';

// Messaggi predefiniti
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di logout';
const SUCCESS_MESSAGE = 'Logout effettuato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const signoutController = async (req, res) => {
    try {
        // Funzione per effettuare il logout dall'account
        let { error } = await supabase.auth.signOut();
        // Verifica che non ci siano eventuali errori specifici di Supabase
        if (error) {
            console.error('BACKEND: Errore da Supabase:', error.message);
            return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: error.message });
        }
        // Invia una risposta di successo
        res.status(200).json({ message: SUCCESS_MESSAGE });
    } catch (error) {
        console.error('BACKEND: Errore imprevisto durante il logout', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
};