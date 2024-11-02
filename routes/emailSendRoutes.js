import express from 'express';
// Importa il controller per inviare email tramite Resend
import { sendEmail } from '../controllers/emailSendController.js';

const router = express.Router();

router.post('/send-email', sendEmail);

export default router;
