import UserModel from "../user/user-model";
import AuthError from "./auth-errors";
import { RegCredantials, LoginCredentials } from "./auth-types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default new class AuthService {
    async registrate(credentials: RegCredantials) {
        try {
            const existingUser = await UserModel.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }]});
            if(existingUser) throw AuthError.UserExists();
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(credentials.password, salt);
            const user = await UserModel.create({...credentials, password: hashedPassword});
            return user;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials: LoginCredentials) {
        try {
            const user = await UserModel.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }]});
            if(!user) throw AuthError.UserNotFound();
            const validPassword = await bcrypt.compare(credentials.password, user.password);
            if (!validPassword) throw AuthError.WrongPassword();
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            return token;
        } catch (error) {
            throw error;
        }
    }   
}