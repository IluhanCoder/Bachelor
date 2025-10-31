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

    async setAvatar(file: any, userId: string, oldAvatarId?: string) {
      console.log(file);
        let imageUploadObject = {
          data: file.buffer,
          contentType: file.mimetype
        };
        const result = await UserModel.findByIdAndUpdate(userId, { avatar: imageUploadObject });
        return result;
      }
}