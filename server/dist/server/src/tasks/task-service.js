"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const task_model_1 = __importDefault(require("./task-model"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
const task_statuses_1 = __importStar(require("./task-statuses"));
exports.default = new class TaskService {
    async addTask(newTask) {
        try {
            // First, get the backlog to find the projectId
            const backlog = await backlog_model_1.default.findById(newTask.backlogId);
            if (!backlog) {
                throw new Error("Backlog not found");
            }
            const task = {
                name: newTask.name,
                desc: newTask.desc,
                isChecked: false,
                createdBy: new mongoose_1.default.Types.ObjectId(newTask.createdBy),
                created: new Date(),
                checkedDate: null,
                projectId: backlog.projectId,
                executors: (newTask.executors ?? []).map(e => new mongoose_1.default.Types.ObjectId(e)),
                status: task_statuses_1.default[0],
                difficulty: newTask.difficulty || task_statuses_1.TaskDifficulties[1],
                priority: newTask.priority || task_statuses_1.TaskPriorities[1],
                requirements: newTask.requirements
            };
            const createdTask = await task_model_1.default.create(task);
            await backlog_model_1.default.findByIdAndUpdate(newTask.backlogId, { "$push": { tasks: createdTask._id } });
        }
        catch (error) {
            throw error;
        }
    }
    async getProjectTasks(projectId) {
        try {
            const result = await backlog_model_1.default.aggregate([
                {
                    $match: {
                        projectId: new mongoose_1.default.Types.ObjectId(projectId)
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
        }
        catch (error) {
            throw error;
        }
    }
    async checkTask(taskId) {
        try {
            await task_model_1.default.findByIdAndUpdate(taskId, { isChecked: true });
        }
        catch (error) {
            throw error;
        }
    }
    async unCheckTask(taskId) {
        try {
            await task_model_1.default.findByIdAndUpdate(taskId, { isChecked: false });
        }
        catch (error) {
            throw error;
        }
    }
    async setStatus(taskId, index) {
        try {
            const query = {
                checkedDate: (index === 2) ? new Date() : null,
                status: task_statuses_1.default[index]
            };
            await task_model_1.default.findByIdAndUpdate(taskId, query);
        }
        catch (error) {
            throw error;
        }
    }
    async assignTask(taskId, userId) {
        try {
            await task_model_1.default.findByIdAndUpdate(taskId, { $push: { executors: userId } });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllTasks(projectId) {
        const result = await backlog_model_1.default.aggregate([
            {
                $match: {
                    projectId: new mongoose_1.default.Types.ObjectId(projectId),
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
    async deleteTask(taskId) {
        await task_model_1.default.findByIdAndDelete(taskId);
    }
    async getTaskById(taskId) {
        const result = await task_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(taskId)
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
                    createdBy: { $toString: "$createdBy" },
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
        ]);
        return result[0];
    }
    async updateTask(taskId, newData) {
        if (newData.status === "done")
            newData.checkedDate = new Date();
        else
            newData.checkedDate = null;
        await task_model_1.default.findByIdAndUpdate(taskId, newData);
    }
    async canUserEditTask(taskId, userId) {
        try {
            const taskData = await task_model_1.default.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(taskId) }
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "projectId",
                        foreignField: "_id",
                        as: "project"
                    }
                },
                {
                    $unwind: "$project"
                }
            ]);
            if (!taskData || taskData.length === 0) {
                return false;
            }
            const task = taskData[0];
            const project = task.project;
            // Check if user is the owner
            if (project.owner.toString() === userId) {
                return true;
            }
            // Find user's participant entry
            const participant = project.participants.find((p) => p.participant.toString() === userId);
            if (!participant) {
                return false;
            }
            // User can edit if they have edit rights
            if (participant.rights.edit) {
                return true;
            }
            // User can edit if they created the task and have create rights
            if (participant.rights.create && task.createdBy?.toString() === userId) {
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error checking task edit permission:', error);
            return false;
        }
    }
    async canUserDeleteTask(taskId, userId) {
        try {
            const taskData = await task_model_1.default.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(taskId) }
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "projectId",
                        foreignField: "_id",
                        as: "project"
                    }
                },
                {
                    $unwind: "$project"
                }
            ]);
            if (!taskData || taskData.length === 0) {
                return false;
            }
            const task = taskData[0];
            const project = task.project;
            // Check if user is the owner
            if (project.owner.toString() === userId) {
                return true;
            }
            // Find user's participant entry
            const participant = project.participants.find((p) => p.participant.toString() === userId);
            if (!participant) {
                return false;
            }
            // User can delete if they have delete rights
            if (participant.rights.delete) {
                return true;
            }
            // User can delete if they created the task and have create rights
            if (participant.rights.create && task.createdBy?.toString() === userId) {
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error checking task delete permission:', error);
            return false;
        }
    }
    async canUserChangeStatus(taskId, userId) {
        try {
            const taskData = await task_model_1.default.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(taskId) }
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "projectId",
                        foreignField: "_id",
                        as: "project"
                    }
                },
                {
                    $unwind: "$project"
                }
            ]);
            if (!taskData || taskData.length === 0) {
                return false;
            }
            const task = taskData[0];
            const project = task.project;
            // Check if user is the owner
            if (project.owner.toString() === userId) {
                return true;
            }
            // Find user's participant entry
            const participant = project.participants.find((p) => p.participant.toString() === userId);
            if (!participant) {
                return false;
            }
            // User can change status if they have check rights
            if (participant.rights.check) {
                return true;
            }
            // User can change status if they created the task and have create rights
            if (participant.rights.create && task.createdBy?.toString() === userId) {
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error checking task status change permission:', error);
            return false;
        }
    }
};
