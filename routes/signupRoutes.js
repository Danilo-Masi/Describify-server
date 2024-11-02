import express from 'express';
// Importa il controller per il signout
import { signupController } from '../controllers/signupController.js';

const router = express.Router();

router.post('/signup', signupController);

export default router;
