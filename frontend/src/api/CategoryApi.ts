import {BaseApi} from "@/api/BaseApi";

export class CategoryApi extends BaseApi{
    constructor() {
        super('/public/categories');
    }
}