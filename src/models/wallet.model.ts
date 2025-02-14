import { mongoose } from '../config/db.config';

const walletSchema = new mongoose.Schema({
    user        : { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    balance     : { type: Number, default: 0 },
    currency    : { type: String, required: true, default: "INR" },
});

export const Wallet = mongoose.model("Wallet", walletSchema);