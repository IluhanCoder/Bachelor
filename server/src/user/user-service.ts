import mongoose from 'mongoose';
import UserModel from "./user-model";
import User, { UserResponse } from "./user-type";

export default new class UserService {
    async fetchUsers(currentUser: User) {
        const result = await UserModel.find({_id: {$ne: currentUser._id}});
        return result;
    }

    async getUserById(userId: string) {
        const result = await UserModel.findById(userId);
          return result;
    }

    async updateUser(userId: string, newData: UserResponse) {
        await UserModel.findByIdAndUpdate(userId, newData);
    }

    async setAvatar(file, userId: string, oldAvatarId?: string) {
      console.log(file);
        let imageUploadObject = {
          data: file.buffer,
          contentType: file.mimetype
        };
        const result = await UserModel.findByIdAndUpdate(userId, { avatar: imageUploadObject });
        return result;
      }
}