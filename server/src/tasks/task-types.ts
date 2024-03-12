import mongoose from "mongoose"
import { UserResponse } from "../user/user-type";

interface Task {
    name: string,
    desc: string,
    backlogId?: mongoose.Types.ObjectId,
    isChecked: boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date | null,
    executors: mongoose.Types.ObjectId[],
    status: String
}

export default Task;

export interface TaskResponse {
    name: string,
    desc: string,
    backlogId: mongoose.Types.ObjectId,
    isChecked: boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date | null,
    executors: UserResponse[],
    status: string
}

export interface TaskCredentials {
    name: string,
    desc: string,
    backlogId: string,
    createdBy: string,
    executors?: mongoose.Types.ObjectId[]
}