import $api from "../axios-setup"
import { UserResponse } from "../user/user-types";

export default new class InviteService {
    async createInvite(guests: UserResponse[], projectId: string) {
        guests.map(async (guest: UserResponse) => {
            await $api.post("invite", {guest: guest._id, projectId});
        })
    }

    async getInvited(projectId: string) {
        return (await $api.get(`/invited/${projectId}`)).data;
    }
}