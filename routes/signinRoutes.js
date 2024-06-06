import express from 'express';
//controllers
import { signinController } from '../controllers/signinController.js';

const router = express.Router();

router.post('/signin', signinController);

export default router;
