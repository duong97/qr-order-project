import {BaseApi} from "@/api/BaseApi";
import {useAuthStore} from "@/store/AuthStore";

export class BaseAdminApi extends BaseApi {
    constructor(path: string) {
        super(path);

        // Interceptor xử lý trước khi gửi request
        // Bổ sung auth token khi call api admin
        this.axiosInstance.interceptors.request.use((req) => {
            const authStore = useAuthStore();
            if (authStore.user) {
                req.headers.Authorization = `Bearer ${authStore.user.token}`;
            }
            return req;
        });
    }

    async create(data: object) {
        const response = await this.axiosInstance.post(this.path, data);
        return response.data;
    }

    async update(id: number, data: object) {
        const response = await this.axiosInstance.put(this.path + '/' + id, data);
        return response.data;
    }

    async delete(id: number) {
        const response = await this.axiosInstance.delete(this.path + '/' + id);
        return response.data;
    }
}