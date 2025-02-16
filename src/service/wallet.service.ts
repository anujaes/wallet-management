import mongoose from "mongoose";
import walletRepositories from "../repositories/wallet.repositories";
import transactionsService from "./transactions.service";
import transactionsRepositories from "../repositories/transactions.repositories";

const FRAUD_THRESHOLD = 3; // Max number of high-value transactions allowed in a short period
const HIGH_VALUE_AMOUNT = 3000; // Define high-value transaction amount
const FRAUD_TIME_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds

const getWallet = async (userId: string) => {
    console.log(userId);
    const result = await walletRepositories.findWalletByUserId(userId);
    return { success: true, status: 200, message: "Record found", data: result };
};

const addFunds = async (userId: string, amount: number) => {
    let result = await walletRepositories.updateWalletBalance(userId, amount);
    if (result) {
        const transaction = await transactionsService.createTransaction({
            user: userId as any,
            type: 'credit',
            amount: amount,
            currency: 'INR',
            status: 'completed'
        });
        console.log("transaction created", transaction);
    }
    return { success: true, status: 200, message: "amount credited!", data: result };
};

const transferFunds = async (userId: string, recipientId: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [senderWallet, recipientWallet] = await Promise.all([
            walletRepositories.findWalletByUserIdSession(userId, session),
            walletRepositories.findWalletByUserIdSession(recipientId, session),
        ]);

        if (!senderWallet || !recipientWallet) {
            await session.abortTransaction();
            await session.endSession(); // ✅ Ensure session is closed
            return {
                success: false,
                status: 404,
                error: senderWallet ? "Recipient not found" : "Sender not found",
            };
        }

        // Validate daily limit
        const dailySpent = await transactionsRepositories.dailyTotalTransaction(userId, session);
        if (dailySpent.remainingLimit < amount) {
            console.log(`Transaction exceeds daily limit of ${dailySpent.dailyLimit}.`);
            await session.abortTransaction();
            await session.endSession(); // ✅ Ensure session is closed
            return {
                success: false,
                status: 400,
                error: `Transaction exceeds daily limit of ${dailySpent.dailyLimit}.`,
            };
        }

        // Fraud detection
        const recentTransactions = await transactionsRepositories.getAllSessionTransactions({
            user: userId,
            type: "debit",
            amount: { $gte: HIGH_VALUE_AMOUNT },
            timestamp: { $gte: new Date(Date.now() - FRAUD_TIME_WINDOW) },
        }, session);

        if (recentTransactions.length >= FRAUD_THRESHOLD) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error("Suspicious activity detected! Multiple high-value transactions in a short period.");
        }

        // Insufficient funds check
        if (senderWallet.balance < amount) {
            await session.abortTransaction();
            await session.endSession();
            return { success: false, status: 400, error: "Insufficient funds" };
        }

        // Update balances
        senderWallet.balance -= amount;
        recipientWallet.balance += amount;

        // ✅ Pass session explicitly in the update
        await Promise.all([
            senderWallet.save({ session }),
            recipientWallet.save({ session })
        ]);

        // Create debit & credit transactions in parallel
        await Promise.all([
            transactionsRepositories.createSessionTransaction({
                user: userId as any,
                type: "debit",
                amount,
                currency: "INR",
                status: "completed",
            }, session),
            transactionsRepositories.createSessionTransaction({
                user: recipientId as any,
                type: "credit",
                amount,
                currency: "INR",
                status: "completed",
            }, session),
        ]);

        await session.commitTransaction(); // ✅ Commit all changes
        await session.endSession(); // ✅ Always close the session

        return { success: true, status: 200, message: "Fund transfer successful" };
    } catch (error) {
        console.error("Transfer failed:", error);
        try {
            await session.abortTransaction();
        } catch (abortError) {
            console.error("Error while aborting transaction:", abortError);
        }
        await session.endSession(); // ✅ Ensure session is closed in all cases

        return { success: false, status: 500, error: "Internal Server Error" };
    }
};



const withdrawFunds = async (userId: string, amount: number) => {
    const wallet = await walletRepositories.findWalletByUserId(userId);

    if (!wallet)
        return { success: false, status: 404, error: "Wallet not found!" };

    if (wallet.balance < amount)
        return { success: false, status: 400, error: "Insufficient funds" };

    wallet.balance -= amount;
    const result = await walletRepositories.saveWallets([wallet]);

    if (result) {
        const transaction = await transactionsService.createTransaction({
            user: userId as any,
            type: 'debit',
            amount: amount,
            currency: 'INR',
            status: 'completed'
        });
        console.log("transaction created!", transaction);
    }
    return { success: true, status: 200, message: "Funds successfully debited!", data: result };
};

const createUserWallet = async (userId: string, currency: string) => {
    const wallet = await walletRepositories.createWallet(userId, currency);

    if (!wallet)
        return { success: false, status: 404, error: "Wallet could not be created!" };

    return { success: true, status: 200, message: "wwallet created successfully!" };
};

export default { getWallet, addFunds, transferFunds, withdrawFunds, createUserWallet };