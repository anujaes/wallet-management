import { User } from "../models/user.model";
import { UserInput, LoginInput } from "../interfaces/user.interfaces";
import userRepositories from "../repositories/user.repositories";
import { hashPassword, generateToken, validatePassword } from "../utils/helper.utils";
import walletRepositories from "../repositories/wallet.repositories";

const registerUser = async (userData: UserInput) => {
    const { name, email, password, wallet, defaultCurrency, dailyTransactionLimit } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { success: false, status: 409, error: "User with this email already exists." };
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        // wallet,
        defaultCurrency,
        dailyTransactionLimit: dailyTransactionLimit || 10000,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    if (newUser) {
        await walletRepositories.createWallet(newUser._id.toString(), defaultCurrency);
    }

    return {
        success: true,
        status: 201,
        message: "User created succesfully!",
        data: userWithoutPassword
    };
};

const loginUser = async ({ email, password }: LoginInput) => {
    const user = await userRepositories.findUserByEmail({ email });
    if (!user) {
        return { success: false, status: 404, error: "User does not found!" };
    }

    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
        return { success: false, status: 401, error: "Invalid email or password." };
    }

    const token = generateToken(user._id.toString(), user.email);
    return {
        success: true,
        status: 200,
        message: "login successfull",
        data: { email: user.email, token }
    };
};

export { registerUser, loginUser };
