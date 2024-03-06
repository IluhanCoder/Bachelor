import mongoose from "mongoose";
import ProjectModel from "./project-model";
import Project, { ExtendedProjectResponse, ProjectCredentials } from "./project-types";
import inviteService from "../invites/invite-service";

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
    $unwind: {
      path: '$participants',
      preserveNullAndEmptyArrays: true
    }
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
    $lookup: {
      from: 'users',
      localField: 'tasks.createdBy',
      foreignField: '_id',
      as: 'creatorsInfo'
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
            createdBy: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$creatorsInfo',
                    as: 'creator',
                    cond: {
                      $eq: ['$$creator._id', '$$task.createdBy']
                    }
                  }
                },
                0
              ]
            },
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
            const result: ExtendedProjectResponse = (await ProjectModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(projectId)
                    }
                },
                ...fullLookUp
              ]))[0]
            result.invited = await inviteService.getInvited(projectId);
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

    async deleteParitcipant(projectId: string, userId: string) {
      try {
        await ProjectModel.findByIdAndUpdate(projectId, {$pull: {participants: {participant: new mongoose.Types.ObjectId(userId)}}});
      } catch (error) {
        throw error;
      }
    }

    async getParicipants(projectId: string) {
      try {
        const result = await ProjectModel.aggregate([
          {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "participants.participant",
                foreignField: "_id",
                as: "participantData"
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id field if not needed
                participants: {
                    $map: {
                        input: "$participants",
                        as: "participant",
                        in: {
                            participant: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: "$participantData",
                                            as: "user",
                                            cond: {
                                                $eq: ["$$user._id", "$$participant.participant"]
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            right: "$$participant.rights"
                        }
                    }
                }
            }
        },
        {
            $unwind: "$participants"
        },
        {
            $replaceRoot: { newRoot: "$participants" }
        }
        ]);
        return result;
      } catch (error) {
        throw error;
      }
    }
}