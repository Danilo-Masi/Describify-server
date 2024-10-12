import express from 'express';
// Controller
import { verifyToken } from '../controllers/verifyTokenController.js';

const router = express.Router();

router.get('/verify-token', verifyToken);

export default router;