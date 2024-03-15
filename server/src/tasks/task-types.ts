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
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
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
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export interface TaskCredentials {
    name: string,
    desc: string,
    backlogId: string,
    createdBy: string,
    executors?: mongoose.Types.ObjectId[],
    requirements: string
}

export interface UpdateTaskCredentials {
    name: string,
    desc: string,
    difficulty: string,
    priority: string,
    requirements: string,
    status: string,
    checkedDate: Date
}