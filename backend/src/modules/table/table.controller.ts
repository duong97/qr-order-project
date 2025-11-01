import { BaseController } from '@/core/base/base.controller';
import { TableService } from './table.service';
import {NextFunction, Request, Response} from "express";
import {SCENARIOS, VISIBLE} from "@/core/const/default";
import {TableModel} from "@/modules/table/table.model";

export class TableController extends BaseController<TableService> {
    constructor() {
        super(new TableService());
    }

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryVisible = String(req.query?.visible || '');
            const queryParams = {
                orderBy: { id: 'desc' },
                where: {
                    visible: queryVisible.length ? Boolean(+queryVisible) : VISIBLE.YES
                }
            } as any;
            queryParams.orderBy = { id: 'desc' }
            const data = await this.service.getAll(queryParams);
            const requests = data.map(request => {
                const tableModel = new TableModel(request);
                return tableModel.toJSON(SCENARIOS.LIST);
            });
            res.json({success: true, data: requests});
        } catch (err) {
            next(err);
        }
    };
}
