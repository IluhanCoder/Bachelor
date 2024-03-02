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
        const result = await inviteModel.aggregate([
            {
                $match: {
                  project: new mongoose.Types.ObjectId(projectId)
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
        ])
        return result.map((invite) => invite.user);
    }
}