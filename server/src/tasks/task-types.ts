import mongoose from "mongoose"

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

export interface TaskCredentials {
    name: string,
    desc: string,
    projectId: string,
    createdBy: string,
    executors?: mongoose.Types.ObjectId[]
}