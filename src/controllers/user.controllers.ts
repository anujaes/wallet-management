import { Request, Response } from 'express';
import { errorResponse, responseHandler } from '../utils/responseHandler.utils';
import { registerUser, loginUser } from '../service/user.service';

const userRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await registerUser(req.body);
        res.status(result.status).send(responseHandler(result));
    } catch (error: any) {
        console.log(error);
        res.status(400).send(errorResponse(error.message));
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser({ email, password });
        res.status(result.status).json(responseHandler(result));
    } catch (error: any) {
        res.status(400).send(errorResponse(error.message));
    }
};

export default { userRegistration, login };