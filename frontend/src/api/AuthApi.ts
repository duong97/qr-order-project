import CurrentUser from "@/interface/CurrentUser";
import {AxiosInstance} from "axios";
import AuthAxios from "@/api/AuthAxios";

export class AuthApi {
    protected authAxios: AxiosInstance;

    constructor() {
        this.authAxios = AuthAxios;
    }

    async login(username: string, password: string) {
        const response = await this.authAxios.post('/auth/login', { username, password });
        return response.data;
    }

    async logout(user: CurrentUser) {
        const response = await this.authAxios.post('/auth/logout', { id: user.id });
        return response.data;
    }
}