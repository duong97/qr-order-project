import {BaseService} from '@/core/base/base.service';
import {RequestRepository} from "@/modules/request/request.repository";
import {REQUEST_SCENARIOS} from "@/core/const/default";
import {RequestModel} from "@/modules/request/request.model";

export class RequestService extends BaseService<RequestRepository> {
    constructor() {
        super(new RequestRepository());
    }

    async create(data: any) {
        const include = RequestModel.getRelations(REQUEST_SCENARIOS.LIST);
        return this.repository.create(data, include);
    }
}
