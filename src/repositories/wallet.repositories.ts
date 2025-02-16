import { Wallet } from "../models/wallet.model";

const findWalletByUserId = async (userId: string) => {
    return await Wallet.findOne({ user: userId });
};

const findWalletByUserIdSession = async (userId: string, session?: any) => {
    return await Wallet.findOne({ user: userId }).session(session);
};

const updateWalletBalance = async (userId: string, amount: number) => {
    return await Wallet.findOneAndUpdate(
        { user: userId },
        { $inc: { balance: amount } },
        { new: true }
    );
};

const saveWallets = async (wallets: any[]) => {
    return await Promise.all(wallets.map(wallet => wallet.save()));
};

const saveSessionWallets = async (wallets: any[], session: any) => {
    return await Promise.all(wallets.map(wallet => wallet.save({ session })));
};

const createWallet = async (userId: string, currency?: any) => {
    return await Wallet.create({
        user: userId,
        balance: 0,
        currency: currency,
    });
};

export default { findWalletByUserId, updateWalletBalance, saveWallets, createWallet, findWalletByUserIdSession, saveSessionWallets };