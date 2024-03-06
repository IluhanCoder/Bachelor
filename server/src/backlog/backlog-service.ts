import mongoose from "mongoose";
import backlogModel from "./backlog-model";

export default new class BacklogService {
    async getProjectBacklogs(projectId: string) {
        const result = await backlogModel.find({projectId: new mongoose.Types.ObjectId(projectId)});
        return result;
    }

    async createBacklog (projectId: string, name: string) {
        await backlogModel.create({projectId: new mongoose.Types.ObjectId(projectId), name, tasks: []});
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
                    as: "taskExecutors"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" }, // Include other backlog fields if needed
                    created: { $first: "$created" },
                    lastModified: { $first: "$lastModified" },
                    owner: { $first: "$owner" },
                    participants: { $first: "$participants" }, // Include participants data if needed
                    tasks: { $push: "$tasks" },
                    taskExecutors: { $push: "$taskExecutors" }
                }
            },
        ]);
        if(result.length > 0) return result[0].tasks;
        else return []
    }
}