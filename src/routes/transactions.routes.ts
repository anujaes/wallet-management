import express from 'express';
import { getUserTransactions } from '../controllers/transactions.controllers';
import { authMiddleware } from '../middleware/auth.middleware';
const transactionsRoutes = express.Router();

transactionsRoutes.post('/', authMiddleware, getUserTransactions);

export default transactionsRoutes;