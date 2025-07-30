import { BaseService } from '@/core/base/base.service';
import { CategoryRepository } from './category.repository';

export class CategoryService extends BaseService<CategoryRepository> {
    constructor(repository: CategoryRepository) {
        super(repository);
    }

    async create(data: any) {
        const existing = await this.repository.findByName(data.name);
        if (existing) throw new Error('Tên đã tồn tại');
        return this.repository.create(data);
    }
}
