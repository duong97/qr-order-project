import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class OrderApi extends BaseAdminApi {
    constructor() {
        super('/admin/orders');
    }
}