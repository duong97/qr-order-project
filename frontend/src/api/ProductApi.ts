import config from "@/config";
import {BaseApi} from "@/api/BaseApi";

export class ProductApi extends BaseApi{
    constructor() {
        super(config.cfConfig.apiUrl + '/products');
    }
}