import config from "@/config";
import {BaseApi} from "@/api/BaseApi";

export class CategoryApi extends BaseApi{
    constructor() {
        super(config.cfConfig.apiUrl + '/categories');
    }
}