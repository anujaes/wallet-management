import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHandler.utils';
import { registerUser, loginUser } from '../service/user.service';

export const userRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await registerUser(req.body);
        res.status(201).send(successResponse(
            'User registered successfully',
            result
        ));
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser({ email, password });
        res.status(200).json(successResponse("Login successful", result));
    } catch (error: any) {
        res.status(400).json(errorResponse(error.message));
    }
};