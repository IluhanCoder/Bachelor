import { UserResponse } from "../user/user-types"

interface Task {
    _id: string,
    name: string,
    desc: string,
    projectId: string,
    isChecked: boolean,
    createdBy: string,
    created: Date,
    checkedDate: Date | undefined,
    executors: string[]
}

export default Task;

export interface TaskCredentials {
    name: string,
    desc: string,
    projectId: string,
    createdBy: string,
    executors?: string[]
}

export interface TaskResponse {
    _id: string,
    name: string,
    desc: string,
    projectId: string,
    isChecked: boolean,
    createdBy: UserResponse,
    created: Date,
    checkedDate: Date | undefined,
    executors: UserResponse[]
}