import {BaseAdminApi} from "@/api/admin/BaseAdminApi";
import OrderApiResponse from "@/interface/OrderApiResponse";

export class OrderApi extends BaseAdminApi {
    constructor() {
        super('/admin/orders');
    }

    formatOrder(order: OrderApiResponse) {
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
    }

    async list() {
        this.path = '/admin/orders';
        const orders = await super.list();
        return orders.map((order: OrderApiResponse) => {
            return this.formatOrder(order);
        }) as OrderApiResponse[];
    }

    async confirm(id: number) {
        this.path = '/admin/orders/' + id + '/confirm';
        const response = await this.axiosInstance.post(this.path);
        if (response?.data?.success) {
            return this.formatOrder(response?.data?.data);
        }
        return null;
    }

    async complete(id: number) {
        this.path = '/admin/orders/' + id + '/complete';
        const response = await this.axiosInstance.post(this.path);
        if (response?.data?.success) {
            return this.formatOrder(response?.data?.data);
        }
        return null;
    }

    async cancel(id: number) {
        this.path = '/admin/orders/' + id + '/cancel';
        const response = await this.axiosInstance.post(this.path);
        if (response?.data?.success) {
            return this.formatOrder(response?.data?.data);
        }
        return null;
    }
}