import { body } from 'express-validator';

export const validateUpdateUser = [
    body('email').isEmail().withMessage('Email non valida'),
    body('newPassword').isLength({ min: 6 }).withMessage('La password deve essere lunga almeno 6 caratteri'),
];