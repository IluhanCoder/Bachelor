import mongoose from "mongoose";

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
  });
  
  const UserModel = mongoose.model('User', userSchema);
  
export default UserModel;