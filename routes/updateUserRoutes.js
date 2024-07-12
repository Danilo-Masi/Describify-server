import express from 'express';
//middleware
import { validateUpdateUser } from '../middleware/validateUpdateUser.js';
//controllers
import { updateUserController } from '../controllers/updateUserController.js';

const router = express.Router();

router.post('/update-user', validateUpdateUser, updateUserController);

export default router;