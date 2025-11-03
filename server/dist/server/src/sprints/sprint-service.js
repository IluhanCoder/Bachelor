"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sprint_model_1 = __importDefault(require("./sprint-model"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
exports.default = new class SprintService {
    async createSprint(backlogId, name, goal = "", startDate, endDate) {
        const newSprint = {
            name,
            goal,
            tasks: [],
            startDate,
            endDate
        };
        const createdSprint = await sprint_model_1.default.create(newSprint);
        await backlog_model_1.default.findByIdAndUpdate(backlogId, { $push: { sprints: new mongoose_1.default.Types.ObjectId(createdSprint._id) } });
    }
    async getBacklogSprints(backlogId) {
        const result = await backlog_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(backlogId)
                }
            },
            {
                $lookup: {
                    from: "sprints",
                    localField: "sprints",
                    foreignField: "_id",
                    as: "sprints"
                }
            }
        ]);
        if (result.length === 0 || !result[0].sprints)
            return [];
        // For each sprint, populate its tasks
        const sprints = result[0].sprints;
        const populatedSprints = await Promise.all(sprints.map(async (sprint) => {
            if (!sprint.tasks || sprint.tasks.length === 0) {
                return {
                    ...sprint,
                    tasks: []
                };
            }
            const tasksResult = await sprint_model_1.default.aggregate([
                {
                    $match: { _id: sprint._id }
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
                    $lookup: {
                        from: "users",
                        localField: "taskData.executors",
                        foreignField: "_id",
                        as: "executorsData"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        tasks: {
                            $push: {
                                $cond: [
                                    { $ne: ["$taskData._id", null] },
                                    {
                                        _id: "$taskData._id",
                                        name: "$taskData.name",
                                        desc: "$taskData.desc",
                                        status: "$taskData.status",
                                        difficulty: "$taskData.difficulty",
                                        priority: "$taskData.priority",
                                        requirements: "$taskData.requirements",
                                        createdBy: "$taskData.createdBy",
                                        executors: "$executorsData"
                                    },
                                    "$$REMOVE"
                                ]
                            }
                        }
                    }
                }
            ]);
            const tasks = tasksResult.length > 0 ? tasksResult[0].tasks : [];
            return {
                _id: sprint._id,
                name: sprint.name,
                goal: sprint.goal,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
                tasks: tasks
            };
        }));
        return populatedSprints;
    }
    async getSprintTasks(sprintId) {
        const result = await sprint_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(sprintId)
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
                    startDate: { $first: "$startDate" },
                    endDate: { $first: "$endDate" },
                    goal: { $first: "$goal" },
                    tasks: { $push: "$tasks" }
                }
            },
        ]);
        if (result.length > 0) {
            // Filter out empty/null tasks
            const tasks = result[0].tasks.filter((task) => task && task._id);
            return tasks;
        }
        else
            return [];
    }
    async pushTask(taskId, sprintId) {
        const convertedTaskId = new mongoose_1.default.Types.ObjectId(taskId);
        await backlog_model_1.default.findOneAndUpdate({ tasks: convertedTaskId }, { $pull: { tasks: convertedTaskId } });
        await sprint_model_1.default.findByIdAndUpdate(sprintId, { $push: { tasks: convertedTaskId } });
    }
    async pullTask(taskId, sprintId) {
        const convertedTaskId = new mongoose_1.default.Types.ObjectId(taskId);
        const convertedSprintId = new mongoose_1.default.Types.ObjectId(sprintId);
        await sprint_model_1.default.findByIdAndUpdate(sprintId, { $pull: { tasks: convertedTaskId } });
        await backlog_model_1.default.findOneAndUpdate({ sprints: sprintId }, { $push: { tasks: convertedTaskId } });
    }
    async editSprint(sprintId, name, goal, startDate, endDate) {
        await sprint_model_1.default.findByIdAndUpdate(sprintId, { name, goal, startDate, endDate });
    }
    async getSprintById(sprintId) {
        return await sprint_model_1.default.findById(sprintId);
    }
    async deleteSprint(sprintId) {
        return await sprint_model_1.default.findByIdAndDelete(sprintId);
    }
    async canUserManageSprint(sprintId, userId) {
        try {
            // Get sprint with backlog and project
            const sprintData = await sprint_model_1.default.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(sprintId) }
                },
                {
                    $lookup: {
                        from: "backlogs",
                        localField: "_id",
                        foreignField: "sprints",
                        as: "backlog"
                    }
                },
                {
                    $unwind: "$backlog"
                },
                {
                    $lookup: {
                        from: "projects",
                        localField: "backlog.projectId",
                        foreignField: "_id",
                        as: "project"
                    }
                },
                {
                    $unwind: "$project"
                }
            ]);
            if (!sprintData || sprintData.length === 0) {
                return false;
            }
            const project = sprintData[0].project;
            // Check if user is the owner
            if (project.owner.toString() === userId) {
                return true;
            }
            // Find user's participant entry
            const participant = project.participants.find((p) => p.participant.toString() === userId);
            if (!participant) {
                return false;
            }
            // User can manage sprints if they have manageSprints rights
            return participant.rights.manageSprints === true;
        }
        catch (error) {
            console.error('Error checking sprint management permission:', error);
            return false;
        }
    }
    async canUserManageSprintByBacklog(backlogId, userId) {
        try {
            // Get backlog with project
            const backlogData = await backlog_model_1.default.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(backlogId) }
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
            if (!backlogData || backlogData.length === 0) {
                return false;
            }
            const project = backlogData[0].project;
            // Check if user is the owner
            if (project.owner.toString() === userId) {
                return true;
            }
            // Find user's participant entry
            const participant = project.participants.find((p) => p.participant.toString() === userId);
            if (!participant) {
                return false;
            }
            // User can manage sprints if they have manageSprints rights
            return participant.rights.manageSprints === true;
        }
        catch (error) {
            console.error('Error checking sprint management permission by backlog:', error);
            return false;
        }
    }
};
