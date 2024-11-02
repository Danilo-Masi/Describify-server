// Route per l'iscrizione alla waitlist
import waitlistRoutes from './routes/waitlistRoutes.js';
// Route per l'invio delle email tramite Resend
import emailSendRoutes from './routes/emailSendRoutes.js';
// Route per il signin
import signinRoutes from './routes/signinRoutes.js';
// Route per il signup
import signupRoutes from './routes/signupRoutes.js';
// Route per il signout
import signoutRoutes from './routes/signoutRoutes.js';
// Route per verificare che l'utente abbia un token di accesso valido
import verifyTokenRoutes from './routes/verifyTokenRoutes.js';
// Route per verificare il numero di crediti disponibili
import creditNumberRoutes from './routes/creditNumberRoutes.js';
// Route per analizzare l'immagine tramite OPENAI
import productImageRoutes from './routes/productImageRoutes.js';
// Route per generazione il titolo e la descrizione
import productRoutes from './routes/productRoutes.js';

export const applyRoutes = (app) => {
    app.use('/', waitlistRoutes);
    app.use('/', emailSendRoutes);
    //app.use('/', signinRoutes);
    //app.use('/', signupRoutes);
    //app.use('/', signoutRoutes);
    //app.use('/', verifyTokenRoutes);
    //app.use('/', creditNumberRoutes);
    //app.use('/', productImageRoutes);
    //app.use('/', productRoutes);
};