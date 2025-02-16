import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userRepositories from "../repositories/user.repositories";

declare module "express" {
    export interface Request {
        user?: any;
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        res.status(401).json({ message: "Access Denied, No Token Provided" });
        return;
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        res.status(400).json({ message: "Invalid Token Format" });
        return;
    }

    const token = tokenParts[1];

    try {
        const verified: any = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] });
        req.user = verified;

        // check if the user exists
        const user = await userRepositories.findUserByEmail({ email: verified.email });
        if (!user)
            res.status(401).json({ message: "Stale or invalid token!" });

        next();
    } catch (error: any) {
        console.log("~authMiddleware error > ", error);
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token Expired" });
        } else if (error.name === "JsonWebTokenError") {
            res.status(400).json({ message: "Malformed Token" });
        } else {
            res.status(401).json({ message: "Invalid Token" });
        }
    }
};
