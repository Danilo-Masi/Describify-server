import express from 'express';
//controllers
import { sendEmail } from '../controllers/emailSendController.js';

const router = express.Router();

router.post('/send-template', sendEmail);

export default router;
