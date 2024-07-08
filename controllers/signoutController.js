import supabase from '../config/supabase.js';

export const signoutController = async (req, res) => {
    try {
        console.log('Funzione Logout: Server');

        // Funzione per effettuare il logout dall'account
        let { error } = await supabase.auth.signOut();

        // Verifica errori durante la fase di logout
        if (error) {
            return res.status(401).json({ error: 'Errore durante la fase di logout.' });
        }

        // Invia una risposta di successo
        res.status(200).json({ message: 'Logout effettuato con successo.' });
    } catch (error) {
        console.error('Errore inatteso durante la fase di logout', error.message);
        res.status(500).json({ error: 'Errore del server durante il logout.' });
    }
};