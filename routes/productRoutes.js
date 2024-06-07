import express from 'express';
//controllers
import { productGeneration } from '../controllers/productController.js';

const router = express.Router();

router.post('/product-generation', productGeneration);

export default router;
