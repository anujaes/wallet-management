import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDB } from "./config/db.config";
import apiLimiter from "./utils/ratelimiter.utils";

// Routes
import userRoutes from "./routes/user.routes";
import walletRoutes from "./routes/wallet.routes";
import transactionsRoutes from "./routes/transactions.routes";


dotenv.config({ path: ".env.local" });
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// api limiter
app.use('/', apiLimiter);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transaction", transactionsRoutes);

(async () => {
    await initializeDB();
})()

export default app;
