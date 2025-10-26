import AxiosBase from "@/api/AxiosBase";
import { AxiosInstance } from "axios";

export class BaseApi {
    protected path: string;
    protected axiosInstance: AxiosInstance;

    constructor(path: string) {
        this.path = path;
        this.axiosInstance = AxiosBase;
    }

    async list(filter?: any) {
        const response = await this.axiosInstance.get(this.path, {
            params: filter,
        });
        return response?.data?.data;
    }
}