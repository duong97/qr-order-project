import { BaseController } from '@/core/base/base.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

export class CategoryController extends BaseController<CategoryService> {
    constructor() {
        super(new CategoryService(new CategoryRepository()));
    }

    // override hoặc thêm action riêng nếu cần
}
