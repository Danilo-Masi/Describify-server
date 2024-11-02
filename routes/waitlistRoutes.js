import express from 'express';
// Importa il controller per l'iscrizione alla waitlist
import { signupToWaitlist } from '../controllers/waitlistController.js';

const router = express.Router();

router.post('/signup-to-waitlist', signupToWaitlist);

export default router;
