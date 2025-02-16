import { Request, Response } from 'express';
import { errorResponse, responseHandler } from '../utils/responseHandler.utils';
import transactionsService from '../service/transactions.service';

export const getUserTransactions = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await transactionsService.getTransactions(req.body);
        res.status(result.status).send(responseHandler(result));
    } catch (error: any) {
        console.log(error);
        res.status(400).send(errorResponse(error.message));
    }
};

// export default { getTransactions };