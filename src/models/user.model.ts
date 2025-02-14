import { mongoose } from '../config/db.config';

const userSchema = new mongoose.Schema({
    name                    : { type: String, required: true },
    email                   : { type: String, required: true, unique: true },
    password                : { type: String, required: true },
    wallet                  : { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    defaultCurrency         : { type: String, required: true, default: "USD" },
    dailyTransactionLimit   : { type: Number, default: 10000 },
});

export const User = mongoose.model("User", userSchema);