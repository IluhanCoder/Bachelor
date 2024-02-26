import mongoose from "mongoose"
import { UserResponse } from "../user/user-type";

interface Task {
    name: string,
    desc: string,
    projectId: mongoose.Types.ObjectId,
    isChecked: boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date | undefined,
    executors: mongoose.Types.ObjectId[]
}

export default Task;

export interface TaskResponse {
    name: string,
    desc: string,
    projectId: mongoose.Types.ObjectId,
    isChecked: boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date | undefined,
    executors: UserResponse[]
}

export interface TaskCredentials {
    name: string,
    desc: string,
    projectId: string,
    createdBy: string,
    executors?: mongoose.Types.ObjectId[]
}