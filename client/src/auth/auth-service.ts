import { LoginCredentials } from './../../../server/src/auth/auth-types';
import { AxiosError } from "axios";
import $api, { dropHeader, setHeader } from "../axios-setup";
import RegCredantials from "./auth-types";
import errorStore from "../errors/error-store";
import userStore from '../user/user-store';

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
            if(res.data.status === "success") { 
                localStorage.setItem("token", res?.data?.token);
                await this.checkAuth();
                return res.data;
            }
        } catch (error: any) {
            if(error?.code === "ERR_BAD_REQUEST")  {
                errorStore.pushError(error?.response?.data?.message);
            }
        }
    }

    async checkAuth() {
        try {
            const token = localStorage.getItem("token");
            if(token) { 
                const {user} = (await $api.post("/verify", {token})).data;
                setHeader(token);
                userStore.setUser(user);
            } else {
                userStore.dropUser();
                dropHeader();
            }
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            localStorage.removeItem("token");
            dropHeader();
            await this.checkAuth();
        } catch (error) {
            throw error;
        }
    }
}