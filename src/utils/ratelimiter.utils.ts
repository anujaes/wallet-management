import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "./responseHandler.utils";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." },
    headers: true,
    handler: (req: Request, res: Response, next: NextFunction) => {
        res.status(429).send(errorResponse("Too many requests, please try again later."));
    },
});

export default apiLimiter;
