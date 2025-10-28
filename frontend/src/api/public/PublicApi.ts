import {BaseApi} from "@/api/BaseApi";
import OrderSubmit from "@/interface/OrderSubmit";
import CreateRequest from "@/interface/CreateRequest";

export class PublicApi extends BaseApi{
    constructor() {
        super('/public/products');
    }

    async categories() {
        this.path = '/public/categories';
        const response = await this.axiosInstance.get(this.path);
        return response?.data?.data;
    }

    async products() {
        this.path = '/public/products';
        const response = await this.axiosInstance.get(this.path);
        return response?.data?.data;
    }

    async submitOrder(order: OrderSubmit) {
        this.path = '/public/orders';
        const response = await this.axiosInstance.post(this.path, order);
        return response?.data;
    }

    async createRequest(request: CreateRequest) {
        this.path = '/public/requests';
        const response = await this.axiosInstance.post(this.path, request);
        return response?.data;
    }
}