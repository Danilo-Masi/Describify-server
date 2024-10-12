import express from 'express';
import { verifyToken } from '../controllers/verifyTokenController.js';

const router = express.Router();

// Definisce una route GET per '/protected' che utilizza il middleware 'verifyToken'
// La route è accessibile solo se il token è valido
router.get('/protected', verifyToken, (req, res) => {
    // Se il token è valido, risponde con un messaggio di successo e invia i dati dell'utente decodificati
    res.status(200).json({ message: 'Accesso consentito!', user: req.user });
});

export default router;