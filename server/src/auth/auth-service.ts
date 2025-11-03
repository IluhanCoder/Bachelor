import UserModel from "../user/user-model";
import { UserDocument } from "../user/user-type";
import AuthError from "./auth-errors";
import { RegCredantials, LoginCredentials } from "./auth-types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default new class AuthService {
    async registrate(credentials: RegCredantials) {
        try {
            // Validation
            if (!credentials.name?.trim()) {
                throw AuthError.BadRequest("Name is required");
            }
            if (!credentials.surname?.trim()) {
                throw AuthError.BadRequest("Surname is required");
            }
            if (!credentials.nickname?.trim()) {
                throw AuthError.BadRequest("Username is required");
            }
            if (!credentials.email?.trim()) {
                throw AuthError.BadRequest("Email is required");
            }
            if (!credentials.password) {
                throw AuthError.BadRequest("Password is required");
            }
            if (credentials.password.length < 6) {
                throw AuthError.BadRequest("Password must be at least 6 characters");
            }

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
            const user: UserDocument | null = await UserModel.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }]});
            if(!user) throw AuthError.UserNotFound();
            const validPassword = await bcrypt.compare(credentials.password, user.password);
            if (!validPassword) throw AuthError.WrongPassword();
            const secret = process.env.JWT_SECRET;
            if(!secret) throw AuthError.VerificationFailed();
            const token = jwt.sign({ userId: user.id }, secret);
            return token;
        } catch (error) {
            throw error;
        }
    }   

    async verifyToken(token: string) {
        interface DecodedJWTPayload {
            userId: string
        }

        try {
            const secret = process.env.JWT_SECRET;
            if(!secret) throw AuthError.VerificationFailed();
            const {userId} = jwt.verify(token, secret) as DecodedJWTPayload;
            if(!userId) throw AuthError.VerificationFailed();
            const user: UserDocument | null = await UserModel.findById(userId);
            if(!user) throw AuthError.UserNotFound();
            return user;
        } catch (error) {
            throw error;
        }
    }
}