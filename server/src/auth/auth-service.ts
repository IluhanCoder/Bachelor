import UserModel from "../user/user-model";
import RegCredantials from "./auth-types";

export default new class AuthService {
    async registrate(credentials: RegCredantials) {
        const user = await UserModel.create(credentials);
        return user;
    }
}