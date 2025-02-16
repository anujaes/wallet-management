import { Transaction } from "../models/transactions.model";

const getAllTransactions = async (filter: any) => {
    return await Transaction.find(filter);
};

const getAllSessionTransactions = async (filter: any, session: any) => {
    return await Transaction.find(filter).session(session);
};

const getTransaction = async (filter: any) => {
    return await Transaction.findOne(filter).sort({ createdAt: -1 });
};

const createTransaction = async (body: any) => {
    const transaction = new Transaction(body);
    return await transaction.save();
}

const createSessionTransaction = async (body: any, session: any) => {
    const transaction = new Transaction(body);
    return await transaction.save({session});
}

const dailyTotalTransaction = async (userId: string, session: any) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Transaction.aggregate([
        {
            $match: {
                user: userId,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: "completed",
            }
        },
        {
            $group: {
                _id: "$user",
                totalAmount: { $sum: "$amount" }, // Sum of all transactions
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                _id: 0,
                totalAmount: 1,
                dailyLimit: "$userDetails.dailyTransactionLimit",
                remainingLimit: { $subtract: ["$userDetails.dailyTransactionLimit", "$totalAmount"] }
            }
        }
    ]).session(session);

    return result.length > 0 ? result[0] : { totalAmount: 0, dailyLimit: 10000, remainingLimit: 10000 };
};


export default {
    getAllTransactions,
    createTransaction,
    getTransaction,
    dailyTotalTransaction,
    getAllSessionTransactions,
    createSessionTransaction
};