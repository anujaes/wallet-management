import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
    export interface Request {
        user?: any;
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied, No Token Provided" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(400).json({ message: "Invalid Token Format" });
    }

    const token = tokenParts[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] });
        req.user = verified as any;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Malformed Token" });
        }
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
