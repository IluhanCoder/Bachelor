import Task, { TaskCredentials, UpdateTaskCredentials } from "./task-types";
import mongoose from "mongoose";
import TaskModel from "./task-model";
import backlogModel from "../backlog/backlog-model";
import TaskStatuses, { TaskDifficulties, TaskPriorities } from "./task-statuses";
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
                status: TaskStatuses[0],
                difficulty: TaskDifficulties[1],
                priority: TaskPriorities[1],
                requirements: newTask.requirements
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
        const query = {
          checkedDate: (index === 2) ? new Date() : null,
          status: TaskStatuses[index]
        }
        await TaskModel.findByIdAndUpdate(taskId, query);
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

    async getAllTasks(projectId: string) {
      const result = await backlogModel.aggregate([
          {
            $match: {
              projectId: new mongoose.Types.ObjectId(projectId),
            },
          },
          {
            $lookup: {
              from: 'sprints',
              localField: 'sprints',
              foreignField: '_id',
              as: 'sprintData',
            },
          },
          {
            $project: {
              tasks: {
                $concatArrays: ['$tasks', { $ifNull: ['$sprintData.tasks', []] }],
              },
            },
          },
          {
            $unwind: {
              path: '$tasks',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'tasks',
              localField: 'tasks',
              foreignField: '_id',
              as: 'taskData',
            },
          },
          {
            $unwind: {
              path: '$taskData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'taskData.executors',
              foreignField: '_id',
              as: 'executorsData',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'taskData.createdBy',
              foreignField: '_id',
              as: 'createdByData',
            },
          },
          {
            $group: {
              _id: null,
              tasks: {
                $push: {
                  _id: '$taskData._id',
                  name: '$taskData.name',
                  desc: '$taskData.desc',
                  projectId: '$taskData.projectId',
                  isChecked: '$taskData.isChecked',
                  created: '$taskData.created',
                  checkedDate: '$taskData.checkedDate',
                  executors: '$executorsData',
                  createdBy: '$createdByData',
                  status: "$taskData.status"
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              tasks: 1,
            },
          },
        ]);
      return result[0].tasks;
  }

  async deleteTask(taskId: string) {
    await TaskModel.findByIdAndDelete(taskId);
  }

  async getTaskById(taskId: string) {
    const result = await TaskModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(taskId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "executors",
          foreignField: "_id",
          as: "executorsData"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          desc: 1,
          requirements: 1,
          priority: 1,
          status: 1,
          difficulty: 1,
          created: 1,
          checkedDate: 1,
          // Other fields you want to include from the task
          executors: {
            $map: {
              input: "$executorsData",
              as: "executor",
              in: {
                _id: "$$executor._id",
                nickname: "$$executor.nickname",
                // Other fields you want to include from the user
              }
            }
          }
        }
      }
    ])
    return result[0];
  }

  async updateTask(taskId: string, newData: UpdateTaskCredentials) {
    if(newData.status === "done") newData.checkedDate = new Date();
    else newData.checkedDate = null;
    await TaskModel.findByIdAndUpdate(taskId, newData);
  }
}
