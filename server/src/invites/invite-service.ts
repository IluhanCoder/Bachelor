import mongoose from "mongoose"
import inviteModel from "./invite-model"

export default new class InviteService {
    async createInvite(host: string, guest: string, projectId: string) {
        await inviteModel.create({
            host: new mongoose.Types.ObjectId(host),
            guest: new mongoose.Types.ObjectId(guest),
            project: new mongoose.Types.ObjectId(projectId)
        })
    }

    async getInvited(projectId: string) {
        const result = await inviteModel.find({project: new mongoose.Types.ObjectId(projectId)});
        return result;
    }
}