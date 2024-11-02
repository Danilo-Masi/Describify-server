import express from 'express';
// Importa il controller per la generazione del titolo e della descrizione tramite OPENAI
import { productGeneration } from '../controllers/productController.js';

const router = express.Router();

router.post('/product-generation', productGeneration);

export default router;
