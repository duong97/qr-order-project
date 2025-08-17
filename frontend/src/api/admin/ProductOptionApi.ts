import {BaseApi} from "@/api/BaseApi";

export class ProductOptionApi extends BaseApi{
    constructor() {
        super('/public/options');
    }
}