import { mongoose } from '../config/db.config';

const transactionSchema = new mongoose.Schema(
    {
        user        : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type        : { type: String, enum: ["credit", "debit"], required: true },
        amount      : { type: Number, required: true },
        currency    : { type: String, required: true },
        status      : { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    }, 
    {   timestamps  : true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
