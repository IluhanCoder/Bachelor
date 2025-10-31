import mongoose from "mongoose";
import ProjectModel from "./project-model";
import { ProjectCredentials, ProjectResponse, ParticipantResponse, Rights } from "@shared/types";
import { Participant } from "./project-types";
import inviteService from "../invites/invite-service";
import backlogModel from "../backlog/backlog-model";
import ProjectError from "./project-errors";

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
      const newProject = {
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
      const result: ProjectResponse = (await ProjectModel.aggregate([
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

    async getUserRights (userId: string, projectId: string) {
      try {
        const project = await ProjectModel.findById(projectId);
        if(!project) throw ProjectError.ProjectNotFound();
        const userParticipating = project.participants.find((participant: any) => (new mongoose.Types.ObjectId(userId)).equals(participant.participant));
        if (userParticipating) return userParticipating.rights;
        else return null;
      } catch (error) {
        throw error;
      }
    }

    async getRights (projectId: string) {
      try {
        const rights = await ProjectModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(projectId) // Replace "your_project_id" with the actual project ID
            }
          },
          {
            $unwind: "$participants"
          },
          {
            $lookup: {
              from: "users",
              localField: "participants.participant",
              foreignField: "_id",
              as: "participants.user"
            }
          },
          {
            $unwind: "$participants.user"
          },
          {
            $project: {
              _id: 0,
              participant: "$participants.user",
              rights: "$participants.rights"
            }
          }
        ]);
        return rights;
      } catch (error) {
        throw error;
      }
    }

    async setRights (projectId: string, newParticipants: Participant[]) {
      try {
        const convertedNewParticipants = newParticipants.map((participant: Participant) => { return {participant: new mongoose.Types.ObjectId(participant.participant), rights: participant.rights}});
        await ProjectModel.findByIdAndUpdate(projectId, {participants: convertedNewParticipants});
      } catch (error) {
        throw error;
      }
    }

    async changeOwner (projectId: string, oldOwnerId: string, newOwnerId: string) {
      try {
        await ProjectModel.findByIdAndUpdate(projectId, {owner: new mongoose.Types.ObjectId(newOwnerId), $pull: { participants: {participant: new mongoose.Types.ObjectId(newOwnerId) }}} );
        const newParticipant: Participant = {participant: new mongoose.Types.ObjectId(oldOwnerId), rights: {
          create: true,
          edit: true,
          delete: true,
          check: true,
          editParticipants: true,
          addParticipants: true,
          editProjectData: true,
          manageSprints: true,
          manageBacklogs: true
        }}
        await ProjectModel.findByIdAndUpdate(projectId, { $push: {participants: newParticipant}});
      } catch (error) {
        throw error;
      }
    }

    async getOwnerId (projectId: string) {
      try {
        const project = await ProjectModel.findById(projectId);
        return project ? project.owner : null;
      } catch (error) {
        throw error;
      }
    }

    async deleteProject (projectId: string) {
      try {
        await backlogModel.deleteMany({projectId: new mongoose.Types.ObjectId(projectId)});
        await ProjectModel.findByIdAndDelete(projectId);
      } catch (error) {
        throw error;
      }
    } 
}