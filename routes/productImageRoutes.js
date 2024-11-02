import express from 'express';
import multer from 'multer';
// Importa il controller per l'analisi delle immagini tramite OPENAI
import { analyzeImage } from '../controllers/productImageControllers.js';

const router = express.Router();

// Configura Multer per la memorizzazione in memoria
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 } // Limite di 5 MB per l'immagine
});

// Usa Multer come middleware per la rotta di analisi dell'immagine
router.post('/analyze-image', upload.single('image'), analyzeImage);

export default router;