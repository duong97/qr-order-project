import {BaseAdminApi} from "@/api/admin/BaseAdminApi";
import OrderApiResponse from "@/interface/OrderApiResponse";

export class OrderApi extends BaseAdminApi {
    constructor() {
        super('/admin/orders');
    }

    async list() {
        return await super.list() as OrderApiResponse[];
    }

    async confirm(id: number) {
        this.path = '/admin/orders/' + id + '/confirm';
        return await this.axiosInstance.post(this.path);
    }

    async complete(id: number) {
        this.path = '/admin/orders/' + id + '/complete';
        return await this.axiosInstance.post(this.path);
    }

    async cancel(id: number) {
        this.path = '/admin/orders/' + id + '/cancel';
        return await this.axiosInstance.post(this.path);
    }
}