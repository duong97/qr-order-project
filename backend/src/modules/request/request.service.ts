import {BaseService} from '@/core/base/base.service';
import {RequestRepository} from "@/modules/request/request.repository";

export class RequestService extends BaseService<RequestRepository> {
    constructor() {
        super(new RequestRepository());
    }

    async create(data: any) {
        return this.repository.create(data);
    }
}
