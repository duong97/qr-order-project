import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class TableApi extends BaseAdminApi{
    constructor() {
        super('/admin/tables');
    }
}