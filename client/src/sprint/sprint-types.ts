import { TaskResponse } from "../task/task-types";

export default interface Sprint {
    _id: string,
    name: string,
    goal: string,
    startDate: Date,
    endDate: Date,
    tasks: string[]
}

export interface SprintResponse {
    _id: string,
    name: string,
    goal: string,
    startDate: Date,
    endDate: Date,
    tasks: TaskResponse[]
}

export interface SprintPutRequest {
    name: string,
    goal: string,
    startDate: Date,
    endDate: Date
}