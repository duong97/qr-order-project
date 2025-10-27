import { BaseController } from '@/core/base/base.controller';
import { TableService } from './table.service';

export class TableController extends BaseController<TableService> {
    constructor() {
        super(new TableService());
    }

    // override hoặc thêm action riêng nếu cần
}
