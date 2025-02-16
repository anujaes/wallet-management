import { User } from "../models/user.model";

async function findUserByEmail(query: any, session?: any) {
    const user = await User.findOne(query);
    
    if (session) {
        user?.$session(session);
    }

    return user;
}

async function findUserById(query: any,) {
    return await User.findOne(query)
}

export default { findUserByEmail, findUserById };