import mongoose from 'mongoose';
import TaskModel from "../tasks/task-model";
import taskService from "../tasks/task-service";
import backlogModel from '../backlog/backlog-model';
import { TaskResponse } from '../tasks/task-types';

export default new class AnalyticsService {
    async fetchTasksStamps(projectId: string) {
        const tasks = await taskService.getAllTasks(projectId);
        const result = [];
        tasks.map((task: TaskResponse) => result.push([task]));
    }

    getMaxDaysInMonth(year, month) {
        // Use the next month's 0th day to get the last day of the current month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        return lastDayOfMonth.getDate();
    }

    async taskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        const tasks = (userId) ? await TaskModel.find({executors: userId}) : await taskService.getAllTasks(projectId);
        const result = [];
        if(daily) {
            const endMonth = (endDate.getMonth() === 0) ? 12 : endDate.getMonth()
            for(let month = startDate.getMonth(); month <= endMonth; month++) {
                for(let day = 1; day <= ((month === endMonth) ? endDate.getDate() : this.getMaxDaysInMonth(endDate.getFullYear(), month)); day++) {
                    let counter = 0;
                    tasks.map((task: TaskResponse) => {
                        if(task.checkedDate && task.checkedDate.getMonth() === month && task.checkedDate.getDate() === day) counter++
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
                        if(task.checkedDate && task.checkedDate.getMonth() === month && task.checkedDate.getFullYear() === year) counter++
                    })
                    result.push({month, year, amount: counter});
                }
            }
        return result
    }


}