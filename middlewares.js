import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

export const applyMiddlewares = (app) => {
    app.use(cors());
    app.use(helmet());
    app.use(compression());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    });
    app.use(limiter);

    if (process.env.NODE_ENV === 'production') {
        app.use(morgan('combined'));
    } else {
        app.use(morgan('dev'));
    }

    app.use(express.json());
};