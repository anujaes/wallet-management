import express from 'express';
import userControllers from '../controllers/user.controllers';
const userRoutes = express.Router();

// User Routes
userRoutes.post('/login', userControllers.login);
userRoutes.post('/register', userControllers.userRegistration);

export default userRoutes;