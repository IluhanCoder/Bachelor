import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
      unique: false,
    },
    surname: {
        type: String,
        required: false,
        unique: false,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    organisation: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: false,
    },
    avatar: {
      type: {
        data: Buffer,
        contentType: String
      },
      required: false
    }
  });

  userSchema.methods.verifyPassword = async function(password: string) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  };
  
  const UserModel = mongoose.model('User', userSchema);
  
export default UserModel;