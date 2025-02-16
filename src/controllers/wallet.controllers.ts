
import { Request, Response } from 'express';
import { errorResponse, responseHandler } from '../utils/responseHandler.utils';
import walletService from '../service/wallet.service';

const getWallet = async (req: Request, res: Response): Promise<any> => {
    try {
        const wallet = await walletService.getWallet(req.user.id);
        res.status(wallet.status).send(responseHandler(wallet));
    } catch (error: any) {
        res.status(500).send(errorResponse(error.message));
    }
};

const addFunds = async (req: Request, res: Response): Promise<any> => {
    try {
        const { amount } = req.body;
        if (amount <= 0)
            return res.status(400).send(errorResponse("Invalid amount"));

        const result = await walletService.addFunds(req.user.id, amount);
        res.status(result.status).send(responseHandler(result));
    } catch (error: any) {
        res.status(500).send(errorResponse(error.message));
    }
};

const transferFunds = async (req: Request, res: Response): Promise<any> => {
    try {
        const { recipientId, amount } = req.body;
        if (amount <= 0)
            return res.status(400).send(errorResponse("Invalid amount"));

        const result = await walletService.transferFunds(req.user.id, recipientId, amount);

        res.status(result.status).send(responseHandler(result));
    } catch (error: any) {
        res.status(500).send(errorResponse(error.message));
    }
};

const withdrawFunds = async (req: Request, res: Response): Promise<any> => {
    try {
        const { amount } = req.body;
        if (amount <= 0)
            return res.status(400).send(errorResponse("Invalid amount"));

        const updatedWallet = await walletService.withdrawFunds(req.user.id, amount);
        res.status(201).send(responseHandler(updatedWallet));
    } catch (error: any) {
        res.status(500).send(errorResponse(error.message));
    }
};

export default { getWallet, addFunds, transferFunds, withdrawFunds };