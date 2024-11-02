import express from 'express';
// Importa il controller per verificare il numero di crediti disponibili
import { getCreditsNumber } from '../controllers/creditNumberController.js';

const router = express.Router();

router.get('/verify-credits', getCreditsNumber);

export default router;
