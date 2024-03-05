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
            endDate: currentDate.getDate() + 30
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
        {$lookup: {
            from: "tasks",
            foreignField: "_id",
            localField: "tasks",
            as: "tasks"
        }
    }]);
    if(result.length > 0) return result[0].tasks;
    else return []
  }

  async pushTask(taskId: string, sprintId: string) {
    const convertedTaskId = new mongoose.Types.ObjectId(taskId);
    await backlogModel.findOneAndUpdate({tasks: convertedTaskId}, {$pull: {tasks: convertedTaskId}});
    await sprintModel.findByIdAndUpdate(sprintId, {$push: {tasks: convertedTaskId}});
  }
}