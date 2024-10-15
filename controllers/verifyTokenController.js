import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

// Estrae il valore della chiave segreta JWT dalle variabili d'ambiente
const { JWT_SECRET } = process.env;

export const verificaToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.warn('Tentativo di accesso senza token');
        return res.status(403).json({ error: 'Accesso negato. Nessun token fornito.' });
    }

    try {
        const decoded = jwt.decode(token);
    } catch (err) {
        console.error("Errore nella decodifica del token:", err.message);
    }

    try {
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) {
                console.error('Errore durante la verifica del token:', error);
                return res.status(401).json({ error: 'Token non valido o scaduto', details: error.message });
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        console.error('Eccezione durante la verifica del token:', err);
        return res.status(500).json({ error: 'Errore interno del server' });
    }
};