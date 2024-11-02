import express from 'express';
// Importa il controller per il signup
import { signoutController } from '../controllers/signoutController.js';

const router = express.Router();

router.post('/signout', signoutController);

export default router;
