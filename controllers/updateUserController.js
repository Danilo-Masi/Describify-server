import supabase from '../config/supabase.js';

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di aggiornamento dei dati';
const SUCCESS_MESSAGE = 'Profilo utente aggiornato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const updateUserController = async (req, res) => {
    console.log('SERVER: UPDATE USER');
    // Preleva i dati presenti nel body della richiesta
    const { newPassword, accessToken } = req.body;
    console.log('SERVER: Dati ricevuti:', { newPassword, accessToken });
    // Verifica che i dati della richiesta non siano campi vuoti
    if (!newPassword || !accessToken) {
        console.error('BACKEND: Token e/o nuova password mancante');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Token e nuova password non sono presenti' });
    }
    try {
        // Aggiorno la password dell'utente
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) {
            console.error('BACKEND: Errore da Supabase:', error.message);
            return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: error.message });
        }
        if (data) {
            console.log('SERVER: Profilo utente aggiornato', data);
            return res.status(200).json({ message: SUCCESS_MESSAGE, data });
        }
    } catch (error) {
        console.error('BACKEND: Errore imprevisto durante aggiornamento profilo utente', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
}