import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

// Estrae il valore della chiave segreta JWT dalle variabili d'ambiente
const { JWT_SECRET } = process.env;

export const verifyToken = (req, res, next) => {
    // Ottiene l'header 'authorization' dalla richiesta
    const authHeader = req.headers['authorization'];
    // Estrae il token dall'header 'authorization', se esiste. 
    // 'Bearer token' è il formato, quindi esegue uno split per ottenere solo il token
    const token = authHeader && authHeader.split(' ')[1];
    // Se non è presente un token, logga un avviso e ritorna un errore 403
    if (!token) {
        console.warn('Tentativo di accesso senza token');
        return res.status(403).json({ error: 'Accesso negato. Nessun token fornito.' });
    }
    // Verifica il token utilizzando 'jwt.verify' e la chiave segreta 'JWT_SECRET'
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        // Se c'è un errore nella verifica, logga l'errore e ritorna un errore 401
        if (error) {
            console.error('Errore durante la verifica del token:', error.message);
            return res.status(401).json({ error: 'Token non valido o scaduto' });
        }
        // Salva i dati dell'utente decodificati dal token nella richiesta per l'uso futuro
        req.user = decoded;
        // Chiama 'next()' per passare al prossimo middleware o al route handler
        next();
    });
};