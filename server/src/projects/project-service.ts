import mongoose from "mongoose";
import ProjectModel from "./project-model";
import Project, { ProjectCredentials } from "./project-types";

const fullLookUp = [
  {
    $lookup: {
      from: "users", // Replace with the actual name of the users collection
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  },
  {
    $unwind: "$owner",
  },
  {
    $unwind: "$participants"
  },
  {
    $lookup: {
      from: "users", // Replace with the actual name of the users collection
      localField: "participants.participant",
      foreignField: "_id",
      as: "participantInfo",
    },
  },
  {
    $project: {
      name: 1,
      created: 1,
      lastModified: 1,
      owner: {
        _id: "$owner._id",
        name: "$owner.name",
        surname: "$owner.surname",
        nickname: "$owner.nickname",
        organisation: "$owner.organisation",
        email: "$owner.email",
      },
      participants: {
        _id: "$participantInfo._id",
        name: "$participantInfo.name",
        surname: "$participantInfo.surname",
        nickname: "$participantInfo.nickname",
        organisation: "$participantInfo.organisation",
        email: "$participantInfo.email",
        rights: "$participants.rights",
      },
      tasks: [],
    },
  },
  {
    $lookup: {
      from: "tasks", // Replace with the actual name of the tasks collection
      localField: "_id",
      foreignField: "projectId",
      as: "tasks",
    },
  },
  {
    $lookup: {
      from: "users", // Replace with the actual name of the users collection
      localField: "tasks.createdBy",
      foreignField: "_id",
      as: "taskCreators",
    },
  },
  // Unwind to flatten the taskCreators array
  {
    $unwind: "$taskCreators",
  },
  {
    $project: {
      _id: 1,
      name: 1,
      created: 1,
      lastModified: 1,
      owner: 1,
      participants: 1,
      tasks: {
        _id: "$tasks._id",
        name: "$tasks.name",
        desc: "$tasks.desc",
        isChecked: "$tasks.isChecked",
        checkedDate: "$tasks.checkedDate",
        executors: "$tasks.executors",
        createdBy: {
          _id: "$taskCreators._id",
          name: "$taskCreators.name",
          surname: "$taskCreators.surname",
          nickname: "$taskCreators.nickname",
          organisation: "$taskCreators.organisation",
          email: "$taskCreators.email",
        },
      },
    },
  },
  // Group by project id to reshape the result
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      created: { $first: "$created" },
      lastModified: { $first: "$lastModified" },
      owner: { $first: "$owner" },
      participants: { $push: "$participantInfo" },
      tasks: { $push: "$tasks" },
    },
  },
]

export default new class ProjectService {
    async createProject(credentials: ProjectCredentials) {
        try {
            const currentDate = new Date();
            const newProject: Project = {
                name: credentials.name,
                owner: new mongoose.Types.ObjectId(credentials.owner),
                created: currentDate,
                lastModified: currentDate,
                participants: []
            }
            const result = await ProjectModel.create(newProject);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getProjectById(projectId: string) {
        try {
            const result = await ProjectModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(projectId)
                    }
                },
                ...fullLookUp
              ])
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getUserProjects(userId: string) {
      try {
        const result = await ProjectModel.aggregate([
          // {
          //   $match: {
          //     $or: [
          //       { owner: new mongoose.Types.ObjectId(userId) },
          //       { 'participants.participant': new mongoose.Types.ObjectId(userId) },
          //     ],
          //   },
          // },
          ...fullLookUp
        ])
        result.map(item => console.log(item));
        return result;
      } catch (error) {
        throw error;
      }
    }
}