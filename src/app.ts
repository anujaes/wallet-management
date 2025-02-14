import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/user.routes";
import { initializeDB } from "./config/db.config";

dotenv.config({path:".env.local"});

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", routes);

(async()=>{
    await initializeDB();
})()

export default app;
