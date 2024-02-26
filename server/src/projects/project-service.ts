import mongoose from "mongoose";
import ProjectModel from "./project-model";
import Project, { ProjectCredentials } from "./project-types";

const fullLookUp = [
  {
    $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'ownerInfo'
    }
  },
  {
    $unwind: '$participants'
  },
  {
    $lookup: {
      from: 'users',
      localField: 'participants.participant',
      foreignField: '_id',
      as: 'participantsInfo'
    }
  },
  {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      created: { $first: '$created' },
      lastModified: { $first: '$lastModified' },
      owner: { $first: '$ownerInfo' },
      participants: {
        $push: {
          participant: { $arrayElemAt: ['$participantsInfo', 0] },
          rights: '$participants.rights'
        }
      },
      tasks: { $first: '$tasks' }
    }
  },
  {
    $lookup: {
      from: 'tasks',
      localField: '_id',
      foreignField: 'projectId',
      as: 'tasks'
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'tasks.executors',
      foreignField: '_id',
      as: 'executorsInfo'
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      created: 1,
      lastModified: 1,
      owner: { $arrayElemAt: ['$owner', 0] },
      participants: 1,
      tasks: {
        $map: {
          input: '$tasks',
          as: 'task',
          in: {
            _id: '$$task._id',
            name: '$$task.name',
            desc: '$$task.desc',
            projectId: '$$task.projectId',
            isChecked: '$$task.isChecked',
            createdBy: '$$task.createdBy',
            created: '$$task.created',
            checkedDate: '$$task.checkedDate',
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
            }
          }
        }
      }
    }
  }
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
          {
            $match: {
              $or: [
                { owner: new mongoose.Types.ObjectId(userId) },
                { 'participants.participant': new mongoose.Types.ObjectId(userId) },
              ],
            },
          },
          ...fullLookUp
        ])
        return result;
      } catch (error) {
        throw error;
      }
    }
}