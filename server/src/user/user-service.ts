import mongoose from 'mongoose';
import UserModel from "./user-model";
import { RegisterCredentials, UserDto } from '@shared/types';
import { UserDocument } from './user-type';

export default new class UserService {
    async fetchUsers(currentUser: UserDto): Promise<UserDocument[]> {
        const result = await UserModel.find({_id: {$ne: currentUser._id}});
        return result;
    }

    async getUserById(userId: string) {
        const result = await UserModel.findById(userId);
          return result;
    }

    async updateUser(userId: string, newData: RegisterCredentials) {
        await UserModel.findByIdAndUpdate(userId, newData);
    }

    async setAvatar(userId: string, file: any) {
        const user = await UserModel.findById(userId);
        if(user) {
            user.image = file.buffer.toString("base64");
            await user.save();
        }
    }
}