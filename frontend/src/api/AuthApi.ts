import CurrentUser from "@/interface/CurrentUser";
import {BaseApi} from "@/api/BaseApi";

export class AuthApi extends BaseApi {
    constructor() {
        super('');
    }

    async login(username: string, password: string) {
        const response = await this.axiosInstance.post('/auth/login', { username, password });
        return response.data;
    }

    async logout(user: CurrentUser) {
        const response = await this.axiosInstance.post('/auth/logout', { id: user.id });
        return response.data;
    }
}