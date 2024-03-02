import $api from "../axios-setup";

export default new class UserService {
    async fetchUsers() {
        return (await $api.get("/users")).data;
    }

    async getUserById(userId: string) {
        return (await $api.get(`/user/${userId}`)).data;
    }
}