"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const project_model_1 = __importDefault(require("./project-model"));
const invite_service_1 = __importDefault(require("../invites/invite-service"));
const backlog_model_1 = __importDefault(require("../backlog/backlog-model"));
const project_errors_1 = __importDefault(require("./project-errors"));
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
];
exports.default = new class ProjectService {
    async createProject(credentials) {
        try {
            const currentDate = new Date();
            const newProject = {
                name: credentials.name,
                owner: new mongoose_1.default.Types.ObjectId(credentials.owner),
                created: currentDate,
                lastModified: currentDate,
                participants: []
            };
            const result = await project_model_1.default.create(newProject);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async getProjectById(projectId) {
        try {
            const result = (await project_model_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(projectId)
                    }
                },
                ...fullLookUp
            ]))[0];
            result.invited = await invite_service_1.default.getInvited(projectId);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserProjects(userId) {
        try {
            const result = await project_model_1.default.aggregate([
                {
                    $match: {
                        $or: [
                            { owner: new mongoose_1.default.Types.ObjectId(userId) },
                            { 'participants.participant': new mongoose_1.default.Types.ObjectId(userId) },
                        ],
                    },
                },
                ...fullLookUp
            ]);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteParitcipant(projectId, userId) {
        try {
            await project_model_1.default.findByIdAndUpdate(projectId, { $pull: { participants: { participant: new mongoose_1.default.Types.ObjectId(userId) } } });
        }
        catch (error) {
            throw error;
        }
    }
    async getParicipants(projectId) {
        try {
            const result = await project_model_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(projectId)
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
        }
        catch (error) {
            throw error;
        }
    }
    async getUserRights(userId, projectId) {
        try {
            const project = await project_model_1.default.findById(projectId);
            if (!project)
                throw project_errors_1.default.ProjectNotFound();
            const userParticipating = project.participants.find((participant) => (new mongoose_1.default.Types.ObjectId(userId)).equals(participant.participant));
            if (userParticipating)
                return userParticipating.rights;
            else
                return null;
        }
        catch (error) {
            throw error;
        }
    }
    async getRights(projectId) {
        try {
            const rights = await project_model_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(projectId) // Replace "your_project_id" with the actual project ID
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
        }
        catch (error) {
            throw error;
        }
    }
    async setRights(projectId, newParticipants) {
        try {
            const convertedNewParticipants = newParticipants.map((participant) => { return { participant: new mongoose_1.default.Types.ObjectId(participant.participant), rights: participant.rights }; });
            await project_model_1.default.findByIdAndUpdate(projectId, { participants: convertedNewParticipants });
        }
        catch (error) {
            throw error;
        }
    }
    async changeOwner(projectId, oldOwnerId, newOwnerId) {
        try {
            await project_model_1.default.findByIdAndUpdate(projectId, { owner: new mongoose_1.default.Types.ObjectId(newOwnerId), $pull: { participants: { participant: new mongoose_1.default.Types.ObjectId(newOwnerId) } } });
            const newParticipant = { participant: new mongoose_1.default.Types.ObjectId(oldOwnerId), rights: {
                    create: true,
                    edit: true,
                    delete: true,
                    check: true,
                    editParticipants: true,
                    addParticipants: true,
                    editProjectData: true,
                    manageSprints: true,
                    manageBacklogs: true
                } };
            await project_model_1.default.findByIdAndUpdate(projectId, { $push: { participants: newParticipant } });
        }
        catch (error) {
            throw error;
        }
    }
    async getOwnerId(projectId) {
        try {
            const project = await project_model_1.default.findById(projectId);
            return project ? project.owner : null;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteProject(projectId) {
        try {
            await backlog_model_1.default.deleteMany({ projectId: new mongoose_1.default.Types.ObjectId(projectId) });
            await project_model_1.default.findByIdAndDelete(projectId);
        }
        catch (error) {
            throw error;
        }
    }
};
