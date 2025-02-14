import express from 'express';
import { userRegistration } from '../controllers/user.controllers';
const routes = express.Router();

// User Routes
routes.post('/user/register', userRegistration);

export default routes;