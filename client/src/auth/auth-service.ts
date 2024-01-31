import { LoginCredentials } from './../../../server/src/auth/auth-types';
import { AxiosError } from "axios";
import $api from "../axios-setup";
import RegCredantials from "./auth-types";
import errorStore from "../errors/error-store";

export default new class AuthService {
    async registrate(credentials: RegCredantials) {
        try {
            const res = await $api.post("/registration", credentials);
            return res.data;
        } catch (error: any) {
            if(error?.code === "ERR_BAD_REQUEST")  {
                errorStore.pushError(error?.response?.data?.message);
            }
        }
    }

    async login(credentials: LoginCredentials) {
        try {
            const res = await $api.post("/login", credentials);
            return res.data;
        } catch (error: any) {
            if(error?.code === "ERR_BAD_REQUEST")  {
                errorStore.pushError(error?.response?.data?.message);
            }
        }
    }
}