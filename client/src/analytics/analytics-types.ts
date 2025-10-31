import { TaskResponse } from "../task/task-types";

export interface TasksAnalyticsResponse {
    year: number,
    month: number,
    day?: number,
    amount: number
}

export interface QuickStatsResponse {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    totalStoryPoints: number;
    completedStoryPoints: number;
    teamSize: number;
    avgTasksPerMember: number;
    completionRate: number;
}

export interface VelocityDataPoint {
    sprintName: string;
    sprintId: string;
    storyPoints: number;
    completedStoryPoints: number;
    completionRate: number;
    startDate: Date;
    endDate: Date;
}

export interface TopContributor {
    userId: string;
    userName: string;
    completedTasks: number;
    completedStoryPoints: number;
    inProgressTasks: number;
    totalTasks: number;
}