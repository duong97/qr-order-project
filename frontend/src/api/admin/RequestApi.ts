import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class RequestApi extends BaseAdminApi {
    constructor() {
        super('/admin/requests');
    }
}