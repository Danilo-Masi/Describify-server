import express from 'express';
//controllers
import { signoutController } from '../controllers/signoutController.js';

const router = express.Router();

router.post('/signout', signoutController);

export default router;
