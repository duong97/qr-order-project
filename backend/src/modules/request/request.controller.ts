import {BaseController} from '@/core/base/base.controller';
import {RequestService} from './request.service';
import {NextFunction, Request, Response} from "express";
import {REQUEST_SCENARIOS, REQUEST_STATUSES} from "@/core/const/default";
import {RequestModel} from "@/modules/request/request.model";

export class RequestController extends BaseController<RequestService> {
    constructor() {
        super(new RequestService());
    }

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryStatus = String(req.query?.status || '');
            let filterStatus = queryStatus.length ? queryStatus?.split(',').map(Number) : [];

            const queryParams = {
                where: {
                    status: {in: filterStatus?.length ? filterStatus : [REQUEST_STATUSES.NEW]}
                }
            } as any;
            queryParams.orderBy = { id: 'desc' }
            queryParams.include = RequestModel.getRelations(REQUEST_SCENARIOS.LIST);
            console.log('queryParams', JSON.stringify(queryParams));
            const data = await this.service.getAll(queryParams);
            const requests = data.map(request => {
                const requestModel = new RequestModel(request);
                return requestModel.toJSON(REQUEST_SCENARIOS.LIST);
            });
            res.json({success: true, data: requests});
        } catch (err) {
            next(err);
        }
    };
}
