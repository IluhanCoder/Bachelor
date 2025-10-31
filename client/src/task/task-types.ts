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
    executors: string[],
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export default Task;

export interface TaskCredentials {
    name: string,
    desc: string,
    projectId?: string,
    createdBy: string,
    executors?: string[],
    requirements: string,
    priority?: string,
    difficulty?: string
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
    status: string,
    executors: UserResponse[],
    difficulty: string,
    priority: string,
    requirements: string
}