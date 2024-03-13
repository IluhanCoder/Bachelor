import mongoose from 'mongoose';
import TaskModel from "../tasks/task-model";
import taskService from "../tasks/task-service";
import backlogModel from '../backlog/backlog-model';
import { TaskResponse } from '../tasks/task-types';
import { UserResponse } from '../user/user-type';
import { SimpleLinearRegression } from "ml-regression-simple-linear";

export default new class AnalyticsService {
    getMaxDaysInMonth(year, month) {
        // Use the next month's 0th day to get the last day of the current month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        return lastDayOfMonth.getDate();
    }

    async fetchTasks (userId: string | undefined, projectId: string) {
        const tasks: any[] = await taskService.getAllTasks(projectId);
        const filteredTasks = (userId) ? tasks.filter((task: TaskResponse) => task.executors.find((executor: UserResponse) => executor._id.toString() === userId)) : tasks;
        return filteredTasks;
    }

    mapTasks(tasks: TaskResponse[], startDate: Date, endDate: Date, condition: (task: TaskResponse, month: number, dayOrYear: number) => boolean, daily: boolean) {
        const result = [];
        if(daily) {
            const endMonth = (endDate.getMonth() === 0) ? 12 : endDate.getMonth()
            for(let month = startDate.getMonth(); month <= endMonth; month++) {
                for(let day = (month === startDate.getMonth()) ? startDate.getDate() : 1; day <= ((month === endMonth) ? endDate.getDate() : this.getMaxDaysInMonth(endDate.getFullYear(), month)); day++) {
                    let counter = 0;
                    tasks.map((task: TaskResponse) => {
                        if(condition(task, month, day)) { counter++ }
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
                        const conditionResult = condition(task, month, year);
                        if(conditionResult) counter++
                    })
                    result.push({month, year, amount: counter});
                }
            }
        return result
    }

    checkedTaskCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) return task.checkedDate && task.checkedDate.getDate() === dayOrYear && task.checkedDate.getMonth() === month
        else return task.checkedDate && task.checkedDate.getMonth() === month && task.checkedDate.getFullYear() === dayOrYear;
    }

    checkedTaskTraceCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) return task.checkedDate && task.checkedDate <= new Date(task.checkedDate.getFullYear(), month, dayOrYear, 23);
        else return task.checkedDate && task.checkedDate <= new Date(dayOrYear,month,1);
    }

    createdTaskTraceCondition = (task: TaskResponse, month: number, dayOrYear: number, daily: boolean) => {
        if(daily) return task.created && task.created <= new Date(task.created.getFullYear(), month, dayOrYear, 23, 59);
        else return task.created && task.created <= new Date(dayOrYear,month,this.getMaxDaysInMonth(dayOrYear, month));
    }

    async checkedTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.checkedTaskCondition(task, month, dayOrYear, daily), daily);
        return result;
    }

    async createdTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const result = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.createdTaskTraceCondition(task, month, dayOrYear, daily), daily);
        return result;
    }
 
    async taskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = await this.fetchTasks(userId, projectId);
        const allTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.createdTaskTraceCondition(task, month, dayOrYear, daily), daily);
        const doneTasks = this.mapTasks(tasks, startDate, endDate, (task: TaskResponse, month: number, dayOrYear: number) => this.checkedTaskTraceCondition(task, month, dayOrYear, daily), daily);
        if(daily) {
            const result = allTasks.map((task: {month: number, day: number, amount: number}, index: number) => doneTasks[index].amount = (task.amount > 0) ? doneTasks[index].amount = doneTasks[index].amount / task.amount * 100 : 0)
        } else {
            const result = allTasks.map((task: {month: number, year: number, amount: number}, index: number) => doneTasks[index].amount = (task.amount > 0) ? doneTasks[index].amount / task.amount * 100 : 0)
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
}