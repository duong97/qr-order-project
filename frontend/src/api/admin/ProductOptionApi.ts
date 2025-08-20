import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class ProductOptionApi extends BaseAdminApi {
    constructor() {
        super('/public/options');
    }
}