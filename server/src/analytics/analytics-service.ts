import mongoose from 'mongoose';
import TaskModel from "../tasks/task-model";
import taskService from "../tasks/task-service";
import backlogModel from '../backlog/backlog-model';
import { TaskResponse, UserDto } from '@shared/types';
import { SimpleLinearRegression } from "ml-regression-simple-linear";
import sprintService from '../sprints/sprint-service';
import sprintModel from '../sprints/sprint-model';
import projectModel from '../projects/project-model';
import userModel from '../user/user-model';

export default new class AnalyticsService {
    getMaxDaysInMonth(year: number, month: number) {
        // Use the next month's 0th day to get the last day of the current month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        return lastDayOfMonth.getDate();
    }

    async fetchTasks (userId: string | undefined, projectId: string) {
        const tasks: any[] = await taskService.getAllTasks(projectId);
    const filteredTasks = (userId) ? tasks.filter((task: TaskResponse) => task.executors.find((executor: UserDto) => executor._id.toString() === userId)) : tasks;
        return filteredTasks;
    }

    mapTasks(tasks: TaskResponse[], startDate: Date, endDate: Date, condition: (task: TaskResponse, month: number, dayOrYear: number) => boolean, daily: boolean) {
        type DateBucket = { month: number; day?: number; year?: number; amount: number };
        const result: DateBucket[] = [];
        
        if(daily) {
            // Daily stats
            const currentDate = new Date(startDate);
            const endDateTime = endDate.getTime();
            
            while(currentDate.getTime() <= endDateTime) {
                const month = currentDate.getMonth();
                const day = currentDate.getDate();
                const year = currentDate.getFullYear();
                
                let counter = 0;
                tasks.forEach((task: TaskResponse) => {
                    if(condition(task, month, day)) { 
                        counter++; 
                    }
                })
                
                result.push({month, day, year, amount: counter});
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else {
            // Monthly stats
            for(let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
                const startMonth = (year === startDate.getFullYear()) ? startDate.getMonth() : 0;
                const endMonth = (year === endDate.getFullYear()) ? endDate.getMonth() : 11;
                
                for(let month = startMonth; month <= endMonth; month++) {
                    let counter = 0;
                    tasks.forEach((task: TaskResponse) => {
                        const conditionResult = condition(task, month, year);
                        if(conditionResult) counter++;
                    })
                    result.push({month, year, amount: counter});
                }
            }
        }
        return result;
    }

    checkedTaskCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) {
            // For daily - dayOrYear is actually the day, but we need year from task
            return !!(task.checkedDate && 
                     task.checkedDate.getDate() === dayOrYear && 
                     task.checkedDate.getMonth() === month);
        }
        else return !!(task.checkedDate && 
                      task.checkedDate.getMonth() === month && 
                      task.checkedDate.getFullYear() === dayOrYear);
    }

    createdTaskCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) {
            return !!(task.created && 
                     task.created.getDate() === dayOrYear && 
                     task.created.getMonth() === month);
        }
        else return !!(task.created && 
                      task.created.getMonth() === month && 
                      task.created.getFullYear() === dayOrYear);
    }

    checkedTaskTraceCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) return !!(task.checkedDate && task.checkedDate <= new Date(task.checkedDate.getFullYear(), month, dayOrYear, 23, 59, 59));
        else return !!(task.checkedDate && task.checkedDate <= new Date(dayOrYear, month, this.getMaxDaysInMonth(dayOrYear, month), 23, 59, 59));
    }

    createdTaskTraceCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) return !!(task.created && task.created <= new Date(task.created.getFullYear(), month, dayOrYear, 23, 59, 59));
        else return !!(task.created && task.created <= new Date(dayOrYear, month, this.getMaxDaysInMonth(dayOrYear, month), 23, 59, 59));
    }

    async checkedTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.checkedTaskCondition(task, month, dayOrYear, daily), daily);
        return result;
    }

    async createdTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.createdTaskCondition(task, month, dayOrYear, daily), daily);
        return result;
    }
 
    async taskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const allTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.createdTaskTraceCondition(task, month, dayOrYear, daily), daily);
        const doneTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.checkedTaskTraceCondition(task, month, dayOrYear, daily), daily);
        if(daily) {
            allTasks.forEach((task, index) => {
                doneTasks[index].amount = (task.amount > 0) ? doneTasks[index].amount / task.amount * 100 : 0;
            });
        } else {
            allTasks.forEach((task, index) => {
                doneTasks[index].amount = (task.amount > 0) ? doneTasks[index].amount / task.amount * 100 : 0;
            });
        }
        return doneTasks;
    }

    async predictRatio(projectId: string, userId: string | undefined) {
        const tasks = await this.taskRatio(projectId, new Date(2024, 0, 0), new Date(2025, 0, 0), false, userId);
        const months = tasks.map(entry => entry.month);
        const ratios = tasks.map(entry => entry.amount);

        // Fit linear regression model
        const regression = new SimpleLinearRegression(months, ratios);

        // Predict ratios for each month of the future year
        const predictedRatios = [];
        for (let month = 0; month <= 11; month++) {
            const predictedRatio = regression.predict(month);
            predictedRatios.push({ year: 2024, month, amount: predictedRatio });
        }

        return predictedRatios;
    }

    // Quick Stats - overview of project
    async getQuickStats(projectId: string, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        
        const getStoryPoints = (difficulty: string): number => {
            const pointsMap: { [key: string]: number } = {
                low: 1, mid: 3, high: 5, hight: 5
            };
            return pointsMap[difficulty] || 0;
        };

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t: TaskResponse) => t.status === 'done').length;
        const inProgressTasks = tasks.filter((t: TaskResponse) => t.status === 'inProgress').length;
        const todoTasks = tasks.filter((t: TaskResponse) => t.status === 'toDo').length;

        const totalStoryPoints = tasks.reduce((sum: number, task: TaskResponse) => 
            sum + getStoryPoints(task.difficulty), 0);
        const completedStoryPoints = tasks
            .filter((t: TaskResponse) => t.status === 'done')
            .reduce((sum: number, task: TaskResponse) => sum + getStoryPoints(task.difficulty), 0);

        // Get team size
        const project = await projectModel.findById(projectId);
        const teamSize = project ? (project.participants?.length || 0) + 1 : 1; // +1 for owner

        const avgTasksPerMember = teamSize > 0 ? totalTasks / teamSize : 0;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            totalStoryPoints,
            completedStoryPoints,
            teamSize,
            avgTasksPerMember: Math.round(avgTasksPerMember * 10) / 10,
            completionRate: Math.round(completionRate * 10) / 10
        };
    }

    // Velocity Chart - SP completed per sprint
    async getVelocityData(projectId: string) {
        // Get all backlogs for the project
        const backlogs = await backlogModel.find({ projectId: new mongoose.Types.ObjectId(projectId) });
        
        const allSprintsData = [];
        
        for (const backlog of backlogs) {
            if (!backlog.sprints || backlog.sprints.length === 0) continue;
            
            const sprints = await sprintModel.find({
                _id: { $in: backlog.sprints }
            }).sort({ startDate: -1 }).limit(10); // Last 10 sprints

            for (const sprint of sprints) {
                if (!sprint.tasks || sprint.tasks.length === 0) {
                    allSprintsData.push({
                        sprintName: sprint.name,
                        sprintId: sprint._id.toString(),
                        storyPoints: 0,
                        completedStoryPoints: 0,
                        completionRate: 0,
                        startDate: sprint.startDate,
                        endDate: sprint.endDate
                    });
                    continue;
                }

                const tasks = await TaskModel.find({
                    _id: { $in: sprint.tasks }
                });

                const getStoryPoints = (difficulty: string): number => {
                    const pointsMap: { [key: string]: number } = {
                        low: 1, mid: 3, high: 5, hight: 5
                    };
                    return pointsMap[difficulty] || 0;
                };

                const totalSP = tasks.reduce((sum, task) => sum + getStoryPoints(task.difficulty || 'low'), 0);
                const completedSP = tasks
                    .filter(task => task.status === 'done')
                    .reduce((sum, task) => sum + getStoryPoints(task.difficulty || 'low'), 0);

                allSprintsData.push({
                    sprintName: sprint.name,
                    sprintId: sprint._id.toString(),
                    storyPoints: totalSP,
                    completedStoryPoints: completedSP,
                    completionRate: totalSP > 0 ? Math.round((completedSP / totalSP) * 100) : 0,
                    startDate: sprint.startDate,
                    endDate: sprint.endDate
                });
            }
        }

        return allSprintsData.sort((a, b) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        ).slice(0, 10);
    }

    // Top Contributors - who's doing the most work
    async getTopContributors(projectId: string) {
        const tasks = await taskService.getAllTasks(projectId);
        
        const getStoryPoints = (difficulty: string): number => {
            const pointsMap: { [key: string]: number } = {
                low: 1, mid: 3, high: 5, hight: 5
            };
            return pointsMap[difficulty] || 0;
        };

        // Group tasks by executor
        const contributorMap = new Map();

        for (const task of tasks) {
            if (!task.executors || task.executors.length === 0) continue;

            for (const executor of task.executors) {
                const userId = executor._id.toString();
                
                if (!contributorMap.has(userId)) {
                    contributorMap.set(userId, {
                        userId,
                        userName: executor.name,
                        completedTasks: 0,
                        completedStoryPoints: 0,
                        inProgressTasks: 0,
                        totalTasks: 0
                    });
                }

                const stats = contributorMap.get(userId);
                stats.totalTasks++;

                if (task.status === 'done') {
                    stats.completedTasks++;
                    stats.completedStoryPoints += getStoryPoints(task.difficulty);
                } else if (task.status === 'inProgress') {
                    stats.inProgressTasks++;
                }
            }
        }

        return Array.from(contributorMap.values())
            .sort((a, b) => b.completedStoryPoints - a.completedStoryPoints)
            .slice(0, 10);
    }
}