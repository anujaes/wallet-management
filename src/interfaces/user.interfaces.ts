interface UserInput {
    name: string;
    email: string;
    password: string;
    wallet?: string;
    defaultCurrency?: string;
    dailyTransactionLimit?: number;
}

interface LoginInput {
    email: string;
    password: string;
}

export { UserInput, LoginInput };