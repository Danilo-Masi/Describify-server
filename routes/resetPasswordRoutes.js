import express from 'express';
//controllers
import { resetPasswordController } from '../controllers/resetPasswordController.js';

const router = express.Router();

router.post('/reset-password', resetPasswordController);

export default router;