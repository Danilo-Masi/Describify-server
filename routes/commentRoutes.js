import express from 'express';
//controllers
import { sendComment } from '../controllers/commentController.js';

const router = express.Router();

router.post('/send-comment', sendComment);

export default router;
