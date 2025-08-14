import {BaseApi} from "@/api/BaseApi";

export class ProductApi extends BaseApi{
    constructor() {
        super('/public/products');
    }
}