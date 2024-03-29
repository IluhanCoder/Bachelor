import mongoose, { mongo } from "mongoose";
import sprintModel from "./sprint-model";
import backlogModel from "../backlog/backlog-model";

export default new class SprintService {
    async createSprint (backlogId: string, name: string) {
        const currentDate = new Date();
        const newSprint = {
            name,
            goal: "",
            tasks: [],
            startDate: currentDate,
            endDate: new Date(2024, 10, 10)
        }
        const createdSprint = await sprintModel.create(newSprint);
        await backlogModel.findByIdAndUpdate(backlogId, {$push: {sprints: new mongoose.Types.ObjectId(createdSprint._id)}});
    }

    async getBacklogSprints (backlogId: string) {
        const result = await backlogModel.aggregate([
            { $match: {
              _id: new mongoose.Types.ObjectId(backlogId)
            }},
            {
              $lookup: {
                from: "sprints",
                localField: "sprints",
                foreignField: "_id",
                as: "sprints"
              }
            }
        ]);
        if(result.length > 0) return result[0].sprints;
        else return []
    }

    async getSprintTasks(sprintId: string) {
      const result = await sprintModel.aggregate([
        {
          $match: {
              _id: new mongoose.Types.ObjectId(sprintId)
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
    if(result.length > 0) return result[0].tasks;
    else return []
  }

  async pushTask(taskId: string, sprintId: string) {
    const convertedTaskId = new mongoose.Types.ObjectId(taskId);
    await backlogModel.findOneAndUpdate({tasks: convertedTaskId}, {$pull: {tasks: convertedTaskId}});
    await sprintModel.findByIdAndUpdate(sprintId, {$push: {tasks: convertedTaskId}});
  }

  async pullTask(taskId: string, sprintId: string) {
    const convertedTaskId = new mongoose.Types.ObjectId(taskId);
    const convertedSprintId = new mongoose.Types.ObjectId(sprintId);
    await sprintModel.findByIdAndUpdate(sprintId, {$pull: {tasks: convertedTaskId}});
    await backlogModel.findOneAndUpdate({sprints: sprintId}, {$push:{tasks: convertedTaskId}});
  }

  async editSprint(sprintId: string, name: string, goal: string, startDate: Date, endDate: Date) {
    await sprintModel.findByIdAndUpdate(sprintId, {name, goal, startDate, endDate});
  }

  async getSprintById(sprintId: string) {
    return await sprintModel.findById(sprintId);
  }

  async deleteSprint(sprintId: string) {
    return await sprintModel.findByIdAndDelete(sprintId);
  }
}