import mongoose from "mongoose";
import backlogModel from "./backlog-model";
import projectModel from "../projects/project-model";

export default new class BacklogService {
    async getProjectBacklogs(projectId: string) {
        const result = await backlogModel.find({projectId: new mongoose.Types.ObjectId(projectId)});
        return result;
    }

    async createBacklog (projectId: string, name: string) {
        await backlogModel.create({projectId: new mongoose.Types.ObjectId(projectId), name, tasks: []});
    }

    async canUserManageBacklog(projectId: string, userId: string): Promise<boolean> {
        try {
            const result = await projectModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(projectId)
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
        } catch (error) {
            console.error("Error checking backlog manage permission:", error);
            return false;
        }
    }

    async getBacklogTasks(backlogId: string) {
        const result = await backlogModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(backlogId)
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
        if(result.length > 0) {
            // Filter out empty/null tasks
            const tasks = result[0].tasks.filter((task: any) => task && task._id);
            return tasks;
        }
        else return []
    }
}