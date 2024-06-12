import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

//Carica le variabili d'ambiente
dotenv.config();

// Import routes
import waitlistRoutes from './routes/waitlistRoutes.js';
import resendRoutes from './routes/resendRoutes.js';

//**************//
//import signinRoutes from './routes/signinRoutes.js';
//import signupRoutes from './routes/signupRoutes.js';

const app = express();

// Middlewares di sicurezza e prestazioni
app.use(cors()); //Permette le richieste da origini diverse
app.use(helmet()); //Aggiunge vari header di sicurezza HTTP
app.use(compression()); //Comprime le risposte HTTP per migliorare le prestazioni

// Rate limit
// Limita ogni IP a 100 richieste per finestra di 15 minuti
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Middleware per il parsing dei JSON
app.use(express.json());

// Routes
app.use('/', waitlistRoutes);
app.use('/', resendRoutes);

//**********************//
//app.use('/', signinRoutes);
//app.use('/', signupRoutes);

// Endpoint di salute
app.get('/healt', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

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

// Gestione della rotta radice
app.get('/', (req, res) => {
  res.status(200).send('Server is running...');
});

// Numero di porta
const port = process.env.PORT || 3000;

// Avvio del server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
