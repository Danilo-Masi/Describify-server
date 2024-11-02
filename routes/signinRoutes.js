import express from 'express';
// Importa il controller per il signin
import { signinController } from '../controllers/signinController.js';

const router = express.Router();

router.post('/signin', signinController);

export default router;
