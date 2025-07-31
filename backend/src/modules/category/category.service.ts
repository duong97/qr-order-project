import {BaseService} from '@/core/base/base.service';
import {CategoryRepository} from './category.repository';
import {ValidationError} from "@/core/middleware/errorHandler";

export class CategoryService extends BaseService<CategoryRepository> {
    constructor(repository: CategoryRepository) {
        super(repository);
    }

    async create(data: any) {
        const existing = await this.repository.findByName(data.name);
        if (existing) throw new ValidationError([
            {path: ['name'], message: 'Name already exists'},
        ]);
        return this.repository.create(data);
    }
}
