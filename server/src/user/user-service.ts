import UserModel from "./user-model";

export default new class UserService {
    async fetchUsers() {
        const result = await UserModel.find();
        return result;
    }
}