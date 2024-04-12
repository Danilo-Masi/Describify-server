import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import morgan from 'morgan';
//Routes
import chatRoutes from './routes/chatRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import resendRoutest from './routes/resendRoutes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/', chatRoutes);
app.use('/', waitlistRoutes);
app.use('/', resendRoutest);

const port = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
