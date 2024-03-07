import mongoose from 'mongoose';
import TaskModel from "../tasks/task-model";
import taskService from "../tasks/task-service";
import backlogModel from '../backlog/backlog-model';
import { TaskResponse } from '../tasks/task-types';

export default new class AnalyticsService {
    getMaxDaysInMonth(year, month) {
        // Use the next month's 0th day to get the last day of the current month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        return lastDayOfMonth.getDate();
    }

    async fetchTasks (userId: string | undefined, projectId: string) {
        const tasks = (userId) ? await TaskModel.find({projectId: new mongoose.Types.ObjectId(projectId), executors: userId}) : await taskService.getAllTasks(projectId);
        return tasks;
    }

    mapTasks(tasks: TaskResponse[], startDate: Date, endDate: Date, condition: (task: TaskResponse) => boolean, daily: boolean) {
        const result = [];
        if(daily) {
            const endMonth = (endDate.getMonth() === 0) ? 12 : endDate.getMonth()
            for(let month = startDate.getMonth(); month <= endMonth; month++) {
                for(let day = 1; day <= ((month === endMonth) ? endDate.getDate() : this.getMaxDaysInMonth(endDate.getFullYear(), month)); day++) {
                    let counter = 0;
                    tasks.map((task: TaskResponse) => {
                        if(task.checkedDate && task.checkedDate.getMonth() === month && task.checkedDate.getDate() === day && condition(task)) counter++
                    })
                    result.push({month, day, amount: counter});
                }
            }
        }
        else
            for(let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
                for(let month = ((year === startDate.getFullYear()) ? startDate.getMonth() : 0); month <= ((year === endDate.getFullYear()) ? endDate.getMonth() : 12); month++) {
                    let counter = 0;
                    tasks.map((task: TaskResponse) => {
                        if(task.checkedDate && task.checkedDate.getMonth() === month && task.checkedDate.getFullYear() === year && condition(task)) counter++
                    })
                    result.push({month, year, amount: counter});
                }
            }
        return result
    }

    async taskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse) => true, daily);
        return result;
    }

    async taskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const allTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse) => true, daily);
        const doneTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse) => task.status === "done", daily);
        if(daily) {
            return allTasks.map((task: {month: number, day: number, amount: number}, index: number) => doneTasks[index].amount / task.amount * 100)
        } else {
            return allTasks.map((task: {month: number, year: number, amount: number}, index: number) => doneTasks[index].amount / task.amount * 100)
        }
    }
}