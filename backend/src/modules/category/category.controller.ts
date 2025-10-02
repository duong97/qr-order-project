import { BaseController } from '@/core/base/base.controller';
import { CategoryService } from './category.service';

export class CategoryController extends BaseController<CategoryService> {
    constructor() {
        super(new CategoryService());
    }

    // override hoặc thêm action riêng nếu cần
}
