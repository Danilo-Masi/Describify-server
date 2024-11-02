import supabase from '../config/supabase.js';

// Messaggi di errore/successo
const MESSAGES = {
    SUPABASE_ERROR_MESSAGE: 'Errore nella fase di logout',
    SERVER_ERROR_MESSAGE: 'Errore del server',
    SUCCESS_MESSAGE: 'Logout effettuato correttamente',
};

export const signoutController = async (req, res) => {
    try {
        // Funzione per effettuare il logout dall'account
        let { error } = await supabase.auth.signOut();

        // Verifica che non ci siano eventuali errori specifici di Supabase
        if (error) {
            console.error('BACKEND: Errore da Supabase:', error.message);
            return res.status(401).json({ error: MESSAGES.SUPABASE_ERROR_MESSAGE });
        }

        // Invia una risposta di successo
        res.status(200).json({ message: MESSAGES.SUCCESS_MESSAGE });

    } catch (error) {
        // Gestisce gli errori
        console.error('BACKEND: Errore imprevisto durante il logout', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR_MESSAGE });
    }
};