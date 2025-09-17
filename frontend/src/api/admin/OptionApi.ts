import {BaseAdminApi} from "@/api/admin/BaseAdminApi";

export class OptionApi extends BaseAdminApi {
    constructor() {
        super('/admin/options');
    }
}