import {BaseAdminApi} from "@/api/admin/BaseAdminApi";
import OrderApiResponse from "@/interface/OrderApiResponse";

export class OrderApi extends BaseAdminApi {
    constructor() {
        super('/admin/orders');
    }

    async list() {
        this.path = '/admin/orders';
        const orders = await super.list();
        return orders.map((order: OrderApiResponse) => {
            if (order.isProcessing) {
                order.tagType = 'warning';
            } else if (order.isCompleted) {
                order.tagType = 'success';
            } else if (order.isCancelled) {
                order.tagType = 'danger';
            } else {
                order.tagType = 'primary';
            }
            return order;
        }) as OrderApiResponse[];
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