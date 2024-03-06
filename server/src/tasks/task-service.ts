import Task, { TaskCredentials } from "./task-types";
import mongoose from "mongoose";
import TaskModel from "./task-model";
import backlogModel from "../backlog/backlog-model";
import TaskStatuses from "./task-statuses";

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
            const result = await TaskModel.aggregate([
                {
                    $match: {
                      projectId: new mongoose.Types.ObjectId(projectId)
                    }
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'executors',
                      foreignField: '_id',
                      as: 'executorsInfo'
                    }
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'createdBy',
                      foreignField: '_id',
                      as: 'createdByInfo'
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      desc: 1,
                      projectId: 1,
                      isChecked: 1,
                      created: 1,
                      checkedDate: 1,
                      executors: {
                        $map: {
                          input: '$executorsInfo',
                          as: 'executor',
                          in: {
                            _id: '$$executor._id',
                            name: '$$executor.name',
                            surname: '$$executor.surname',
                            nickname: '$$executor.nickname',
                            organisation: '$$executor.organisation',
                            email: '$$executor.email'
                          }
                        }
                      },
                      createdBy: {
                        $arrayElemAt: ['$createdByInfo', 0]
                      }
                    }
                  }
            ])
            return result;
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
