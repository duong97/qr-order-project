import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class ProductApi extends BaseAdminApi {
    constructor() {
        super('/admin/products');
    }
}