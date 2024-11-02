import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

// Messaggi di errore/successo
const MESSAGES = {
    TOKEN_ERROR_MESSAGE: 'Nessun token fornito',
    DECODE_TOKEN_ERROR_MESSAGE: 'Errore nella decodifica del token',
    TOKEN_FAIL_ERROR_MESSAGE: 'Token non valido o scaduto',
    SERVER_ERROR_MESSAGE: 'Errore del server',
};

// Estrae il valore della chiave segreta JWT dalle variabili d'ambiente
const { JWT_SECRET } = process.env;

export const verificaToken = (req, res, next) => {
    // Preleva il token dall'header della richiesta
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Verifica che il token sia stato fornito correttamente
    if (!token) {
        console.error('Nessun token fornito');
        return res.status(403).json({ error: MESSAGES.TOKEN_ERROR_MESSAGE });
    }

    // Decodifica del token
    try {
        const decoded = jwt.decode(token);
    } catch (err) {
        console.error("Errore nella decodifica del token:", err.message);
        return res.status(403).json({ error: MESSAGES.DECODE_TOKEN_ERROR_MESSAGE });
    }

    // Verifica del token
    try {
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) {
                console.error('Errore durante la verifica del token:', error.message);
                return res.status(401).json({ error: MESSAGES.TOKEN_FAIL_ERROR_MESSAGE });
            }
            req.user = decoded;
            next();
        });

    } catch (error) {
        // Gestione degli errori
        console.error('Eccezione durante la verifica del token:', error.message);
        return res.status(500).json({ error: MESSAGES.SERVER_ERROR_MESSAGE });
    }
};