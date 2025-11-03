"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invite_model_1 = __importDefault(require("./invite-model"));
const project_model_1 = __importDefault(require("../projects/project-model"));
exports.default = new class InviteService {
    async createInvite(host, guest, projectId) {
        await invite_model_1.default.create({
            host: new mongoose_1.default.Types.ObjectId(host),
            guest: new mongoose_1.default.Types.ObjectId(guest),
            project: new mongoose_1.default.Types.ObjectId(projectId)
        });
    }
    async getInvited(projectId) {
        const result = await invite_model_1.default.aggregate([
            {
                $match: {
                    project: new mongoose_1.default.Types.ObjectId(projectId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'guest',
                    foreignField: '_id',
                    as: 'invitedUserInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        $arrayElemAt: ['$invitedUserInfo', 0]
                    }
                    // Add other fields from the user or invite schema if needed
                }
            }
        ]);
        return result.map((invite) => invite.user);
    }
    async getInvitesToUser(userId) {
        const result = await invite_model_1.default.aggregate([
            {
                $match: {
                    guest: new mongoose_1.default.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'host',
                    foreignField: '_id',
                    as: 'hostInfo'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'project',
                    foreignField: '_id',
                    as: 'projectInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    host: {
                        $arrayElemAt: ['$hostInfo', 0]
                    },
                    project: {
                        $arrayElemAt: ['$projectInfo', 0]
                    }
                    // Add other fields from the invite schema if needed
                }
            }
        ]);
        return result;
    }
    async seeInvite(inviteId, accept) {
        const invite = await invite_model_1.default.findById(inviteId);
        if (!invite)
            return;
        if (accept) {
            await project_model_1.default.findByIdAndUpdate(invite.project, { $push: {
                    participants: {
                        participant: invite.guest,
                        rights: {
                            create: true,
                            edit: false,
                            delete: false,
                            check: false,
                            editParticipants: false,
                            addParticipants: false,
                            editProjectData: false,
                            manageSprints: false
                        }
                    }
                } });
        }
        await invite_model_1.default.findByIdAndDelete(inviteId);
    }
    async cancelInvite(guestId, projectId) {
        await invite_model_1.default.deleteOne({
            guest: new mongoose_1.default.Types.ObjectId(guestId),
            project: new mongoose_1.default.Types.ObjectId(projectId)
        });
    }
};
