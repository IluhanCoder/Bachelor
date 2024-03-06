import Task, { TaskCredentials } from "./task-types";
import mongoose from "mongoose";
import TaskModel from "./task-model";
import backlogModel from "../backlog/backlog-model";
import TaskStatuses from "./task-statuses";
import ProjectModel from "../projects/project-model";

export default new class TaskService {
    async addTask(newTask: TaskCredentials) {
        try {
            const task: Task = {
                name: newTask.name,
                desc: newTask.desc,
                isChecked: false,
                createdBy: new mongoose.Types.ObjectId(newTask.createdBy),
                created: new Date(),
                checkedDate: undefined,
                backlogId: new mongoose.Types.ObjectId(newTask.backlogId),
                executors: newTask.executors ?? [],
                status: TaskStatuses[0]
            };
            const createdTask = await TaskModel.create(task);
            await backlogModel.findByIdAndUpdate(newTask.backlogId, {"$push": {tasks: createdTask._id}});
        } catch (error) {
            throw error;
        }
    }

    async getProjectTasks(projectId: string) {
        try {
          const result = await backlogModel.aggregate([
            {
              $match: {
                  projectId: new mongoose.Types.ObjectId(projectId)
              }
          },
          {
              $lookup: {
                  from: "sprints",
                  localField: "sprints",
                  foreignField: "_id",
                  as: "backlogSprints"
              }
          },
          {
              $project: {
                  tasks: {
                      $concatArrays: [
                          "$tasks",
                          { $ifNull: ["$backlogSprints.tasks", []] }
                      ]
                  }
              }
          },
          {
              $unwind: {
                  path: "$tasks",
                  preserveNullAndEmptyArrays: true
              }
          },
          {
              $lookup: {
                  from: "tasks",
                  localField: "tasks",
                  foreignField: "_id",
                  as: "taskData"
              }
          },
          {
              $unwind: {
                  path: "$taskData",
                  preserveNullAndEmptyArrays: true
              }
          },
          {
              $group: {
                  _id: null,
                  tasks: { $push: "$taskData" }
              }
          },
          {
              $project: {
                  _id: 0,
                  tasks: 1
              }
          }
        ]);
            return result[0].tasks;
        } catch (error) {
            throw error;
        }
    }

    async checkTask (taskId: string) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, { isChecked: true });
      } catch (error) {
        throw error;
      }
    }

    async unCheckTask (taskId: string) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, { isChecked: false });
      } catch (error) {
        throw error;
      }
    }

    async setStatus (taskId: string, index: number) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, {status: TaskStatuses[index]});
      } catch (error) {
        throw error;
      }
    }

    async assignTask (taskId: string, userId: string) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, {$push: {executors: userId}});
      } catch (error) {
        throw error;
      }
    }
}
