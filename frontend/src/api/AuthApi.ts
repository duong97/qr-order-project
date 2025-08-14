import CurrentUser from "@/interface/CurrentUser";
import Api from "@/api/Api";

export class AuthApi {
    async login(username: string, password: string) {
        const response = await Api.post('/auth/login', { username, password });
        return response.data;
    }

    async logout(user: CurrentUser) {
        const response = await Api.post('/auth/logout', { id: user.id });
        return response.data;
    }
}