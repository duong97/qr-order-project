import {BaseAdminApi} from "@/api/admin/BaseAdminApi";
import OrderApiResponse from "@/interface/OrderApiResponse";

export class OrderApi extends BaseAdminApi {
    constructor() {
        super('/admin/orders');
    }

    async list() {
        this.path = '/admin/orders';
        return await super.list() as OrderApiResponse[];
    }

    async confirm(id: number) {
        this.path = '/admin/orders/' + id + '/confirm';
        const response = await this.axiosInstance.post(this.path);
        return response?.data;
    }

    async complete(id: number) {
        this.path = '/admin/orders/' + id + '/complete';
        const response = await this.axiosInstance.post(this.path);
        return response?.data;
    }

    async cancel(id: number) {
        this.path = '/admin/orders/' + id + '/cancel';
        const response = await this.axiosInstance.post(this.path);
        return response?.data;
    }
}