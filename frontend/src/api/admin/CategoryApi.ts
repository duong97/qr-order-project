import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class CategoryApi extends BaseAdminApi{
    constructor() {
        super('/admin/categories');
    }
}