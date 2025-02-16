import transactionsRepositories from "../repositories/transactions.repositories";
import { TransactionQueryParams, TransactionRequestBody } from "../interfaces/transaction.interfaces";


const getTransactions = async (query: TransactionQueryParams) => {

    const { user, type, status, minAmount, maxAmount, startDate, endDate } = query;
    let filter: any = {
        ...(user && { user }),
        ...(type && { type }),
        ...(status && { status }),
        ...(minAmount && { amount: { $gte: Number(minAmount) } }),
        ...(maxAmount && { amount: { $lte: Number(maxAmount) } }),
        ...(startDate && { timestamp: { $gte: new Date(startDate) } }),
        ...(endDate && { timestamp: { $lte: new Date(endDate) } }),
    };

    const result = await transactionsRepositories.getAllTransactions(filter);

    if (result.length) {
        return { success: false, status: 404, error: "No records found!" };
    }

    return {
        success: true,
        status: 200,
        message: "Records found!",
        data: result
    };
};

const createTransaction = async (transaction: TransactionRequestBody) => {
    const data = {
        user: transaction.user,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency || 'INR',
        status: transaction.status
    }
    const result = await transactionsRepositories.createTransaction(data);
    return { success: true, status: 201, message: "Transaction created successfully!", data: result };
}

export default { getTransactions, createTransaction };
