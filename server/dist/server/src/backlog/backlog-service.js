"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const backlog_model_1 = __importDefault(require("./backlog-model"));
const project_model_1 = __importDefault(require("../projects/project-model"));
exports.default = new class BacklogService {
    async getProjectBacklogs(projectId) {
        const result = await backlog_model_1.default.find({ projectId: new mongoose_1.default.Types.ObjectId(projectId) });
        return result;
    }
    async createBacklog(projectId, name) {
        await backlog_model_1.default.create({ projectId: new mongoose_1.default.Types.ObjectId(projectId), name, tasks: [] });
    }
    async canUserManageBacklog(projectId, userId) {
        try {
            const result = await project_model_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(projectId)
                    }
                },
                {
                    $addFields: {
                        isOwner: {
                            $eq: [{ $toString: "$owner" }, userId]
                        },
                        participant: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$participants",
                                        as: "p",
                                        cond: { $eq: [{ $toString: "$$p.userId" }, userId] }
                                    }
                                },
                                0
                            ]
                        }
                    }
                },
                {
                    $project: {
                        hasPermission: {
                            $or: [
                                "$isOwner",
                                { $eq: ["$participant.rights.manageBacklogs", true] }
                            ]
                        }
                    }
                }
            ]);
            return result.length > 0 && result[0].hasPermission;
        }
        catch (error) {
            console.error("Error checking backlog manage permission:", error);
            return false;
        }
    }
    async getBacklogTasks(backlogId) {
        const result = await backlog_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(backlogId)
                }
            },
            {
                $lookup: {
                    from: "tasks",
                    foreignField: "_id",
                    localField: "tasks",
                    as: "tasks"
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
                    from: "users",
                    foreignField: "_id",
                    localField: "tasks.executors",
                    as: "executorsData"
                }
            },
            {
                $addFields: {
                    "tasks.executors": "$executorsData"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    created: { $first: "$created" },
                    lastModified: { $first: "$lastModified" },
                    owner: { $first: "$owner" },
                    participants: { $first: "$participants" },
                    tasks: { $push: "$tasks" }
                }
            },
        ]);
        console.log(result[0]);
        if (result.length > 0) {
            // Filter out empty/null tasks
            const tasks = result[0].tasks.filter((task) => task && task._id);
            return tasks;
        }
        else
            return [];
    }
};
