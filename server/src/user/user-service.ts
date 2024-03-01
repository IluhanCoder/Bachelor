import UserModel from "./user-model";
import User from "./user-type";

export default new class UserService {
    async fetchUsers(currentUser: User) {
        const result = await UserModel.find({_id: {$ne: currentUser._id}});
        return result;
    }
}