import {BaseApi} from "@/api/BaseApi";

export class PublicApi extends BaseApi{
    constructor() {
        super('/public/products');
    }

    async categories() {
        this.path = '/public/categories';
        const response = await this.axiosInstance.get(this.path);
        return response.data.data;
    }
    async products() {
        this.path = '/public/products';
        const response = await this.axiosInstance.get(this.path);
        return response.data.data;
    }
}