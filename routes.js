import waitlistRoutes from './routes/waitlistRoutes.js';
import resendRoutes from './routes/resendRoutes.js';
//import signinRoutes from './routes/signinRoutes.js';
//import signupRoutes from './routes/signupRoutes.js';
//import signoutRoutes from './routes/signoutRoutes.js';
//import verifyTokenRoutes from './routes/verifyTokenRoutes.js';
//import emailSendRoutes from './routes/emailSendRoutes.js';
//import productRoutes from './routes/productRoutes.js';
//import productImageRoutes from './routes/productImageRoutes.js';

export const applyRoutes = (app) => {
    app.use('/', waitlistRoutes);
    app.use('/', resendRoutes);
    //app.use('/', signinRoutes);
    //app.use('/', signupRoutes);
    //app.use('/', signoutRoutes);
    //app.use('/', verifyTokenRoutes);
    //app.use('/', emailSendRoutes);
    //app.use('/', productRoutes);
    //app.use('/', productImageRoutes);
};