import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
// import chatRoutes from './routes/chatRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import resendRoutes from './routes/resendRoutes.js'; // Corretto typo

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// app.use('/', chatRoutes);
app.use('/', waitlistRoutes);
app.use('/', resendRoutes);

const port = process.env.PORT || 3000;

// Gestione degli errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
