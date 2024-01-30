import $api from "../axios-setup";
import RegCredantials from "./auth-types";

export default new class AuthService {
    async registrate(credentials: RegCredantials) {
        const res = await $api.post("/registration", credentials);
        return res.data;
    }
}