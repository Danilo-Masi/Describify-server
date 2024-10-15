import express from 'express';
import { verificaToken } from '../controllers/verifyTokenController.js';

const router = express.Router();

// Rotta per verificare il token
router.get('/verify-token', (req, res, next) => {
    next();
}, verificaToken, (req, res) => {
    res.status(200).json({ message: 'Token valido', user: req.user });
});

export default router;