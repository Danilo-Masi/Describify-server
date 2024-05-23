import express from 'express';
//controllers
import { sendEmail } from '../controllers/resendController.js';

const router = express.Router();

router.post('/send-email', sendEmail);

export default router;
