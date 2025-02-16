import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId: string, email: string): string => {
    return jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
};

const validatePassword = async (inputPassword: string, storedPassword: string): Promise<boolean> => {
    return bcrypt.compare(inputPassword, storedPassword);
};

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY';
function currencyConverter(amount: number, fromCurrency: Currency, toCurrency: Currency) {
    const exchangeRates = {
        INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80, INR: 1 },
        USD: { INR: 83.3, EUR: 0.92, GBP: 0.79, JPY: 149.5, USD: 1 },
        EUR: { INR: 90.5, USD: 1.09, GBP: 0.86, JPY: 161.2, EUR: 1 },
        GBP: { INR: 105.6, USD: 1.27, EUR: 1.16, JPY: 187.5, GBP: 1 },
        JPY: { INR: 0.56, USD: 0.0067, EUR: 0.0062, GBP: 0.0053, JPY: 1 }
    };

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        return "Invalid currency code.";
    }

    const convertedAmount = amount * exchangeRates[fromCurrency][toCurrency];
    return `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    
    // Example usage:
    // console.log(currencyConverter(100, "INR", "USD")); // Convert 100 INR to USD
    // console.log(currencyConverter(50, "USD", "INR"));  // Convert 50 USD to INR
    // console.log(currencyConverter(200, "EUR", "JPY")); // Convert 200 EUR to JPY
}



export { generateToken, validatePassword, hashPassword, currencyConverter };