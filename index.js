import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
import { applyMiddlewares } from './middlewares.js';
import { applyRoutes } from './routes.js';

dotenv.config();

const app = express();
applyMiddlewares(app);
applyRoutes(app);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});