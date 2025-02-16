import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import walletControllers from '../controllers/wallet.controllers';
const walletRoutes = express.Router();

walletRoutes.get("/",           authMiddleware, walletControllers.getWallet);
walletRoutes.post("/add",       authMiddleware, walletControllers.addFunds);
walletRoutes.post("/transfer",  authMiddleware, walletControllers.transferFunds);
walletRoutes.post("/withdraw",  authMiddleware, walletControllers.withdrawFunds);

export default walletRoutes;