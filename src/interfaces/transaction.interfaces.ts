import { Types } from "mongoose";

interface TransactionQueryParams {
    user?: string;
    type?: "credit" | "debit";
    status?: "pending" | "completed" | "failed";
    minAmount?: string;
    maxAmount?: string;
    startDate?: string;
    endDate?: string;
}

interface TransactionRequestBody {
    user: Types.ObjectId;
    type: "credit" | "debit";
    amount: number;
    currency: string;
    status?: "pending" | "completed" | "failed";
}

export { TransactionQueryParams, TransactionRequestBody };