// services/userService.ts
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { UserInput, LoginInput } from "../interfaces/user.interfaces";
import jwt from "jsonwebtoken";

const registerUser = async (userData: UserInput) => {
    try {
        const { name, email, password, wallet, defaultCurrency, dailyTransactionLimit } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            wallet,
            defaultCurrency: defaultCurrency, // default INR
            dailyTransactionLimit: dailyTransactionLimit || 10000,
        });

        // Remove password from response for security
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        return userWithoutPassword;
    } catch (error: any) {
        throw new Error(error.message || "User registration failed.");
    }
};

const loginUser = async ({ email, password }: LoginInput) => {
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password.");
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password.");
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" } // Token valid for 7 days
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return { user: userWithoutPassword, token };
    } catch (error: any) {
        throw new Error(error.message || "Login failed.");
    }
};

export { loginUser };


export { registerUser };
