import config from "@/config";
import {BaseApi} from "@/api/BaseApi";

export class ProductOptionApi extends BaseApi{
    constructor() {
        super(config.cfConfig.apiUrl + '/options');
    }
}