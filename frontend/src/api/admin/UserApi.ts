import AxiosBase from "@/api/AxiosBase";
import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class UserApi extends BaseAdminApi {
    constructor() {
        super('/admin/users');
    }

    async currentUserInfo() {
        const response = await AxiosBase.post('/admin/users/current');
        return response.data;
    }
}