import express from 'express';
//controllers
import { analyzeImage } from '../controllers/productImageControllers.js';

const router = express.Router();

router.post('/analyze-image', analyzeImage);

export default router;
