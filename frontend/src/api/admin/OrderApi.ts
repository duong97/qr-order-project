import {BaseAdminApi} from "@/api/admin/BaseAdminApi";
import OrderApiResponse from "@/interface/OrderApiResponse";

export class OrderApi extends BaseAdminApi {
    constructor() {
        super('/admin/orders');
    }

    async list() {
        return await super.list() as OrderApiResponse[];
    }
}