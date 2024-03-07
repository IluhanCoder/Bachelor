import { TaskResponse } from "../task/task-types";

export interface TasksAnalyticsResponse {
    year: number,
    month: number,
    day?: number,
    amount: number
}