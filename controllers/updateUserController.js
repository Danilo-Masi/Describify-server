import supabase from '../config/supabase.js';

// Messaggi predefiniti
const VALIDATION_ERROR_MESSAGE = 'Errore di validazione';
const SUPABASE_ERROR_MESSAGE = 'Errore nella fase di aggiornamento dei dati';
const SUCCESS_MESSAGE = 'Profilo utente aggiornato correttamente';
const SERVER_ERROR_MESSAGE = 'Errore del server';

export const updateUserController = async (req, res) => {
    // Preleva i dati presenti nel body della richiesta
    const { newPassword, accessToken } = req.body;
    // Verifica che i dati della richiesta non siano campi vuoti
    if (!newPassword) {
        console.error('BACKEND: Email e/o nuova password mancante');
        return res.status(400).json({ error: VALIDATION_ERROR_MESSAGE, details: 'Email e nuova password non sono presenti' });
    }
    try {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                // Funzione per aggiornare i dati del profilo utente
                const { data, error } = await supabase.auth.updateUser({
                    password: newPassword
                }, {
                    accessToken: accessToken // Utilizza l'access token dalla sessione
                });
                // Verifica che non ci siano eventuali errori specifici di Supabase
                if (error) {
                    console.error('BACKEND: Errore da Supabase:', error.message);
                    return res.status(401).json({ error: SUPABASE_ERROR_MESSAGE, details: error.message });
                }
                // Invia una risposta di successo
                return res.status(200).json({ message: SUCCESS_MESSAGE, data });
            }
        });
    } catch (error) {
        // Invia una risposta di errore imprevisto
        console.error('BACKEND: Errore imprevisto durante aggiornamento profilo utente', error.message);
        return res.status(500).json({ error: SERVER_ERROR_MESSAGE, details: error.message });
    }
}