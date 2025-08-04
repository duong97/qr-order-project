import {BaseService} from '@/core/base/base.service';
import {ProductRepository} from './product.repository';
import {ValidationError} from "@/core/middleware/errorHandler";

export class ProductService extends BaseService<ProductRepository> {
    constructor(repository: ProductRepository) {
        super(repository);
    }

    async create(data: any) {
        const existing = await this.repository.findByName(data.name);
        if (existing) throw new ValidationError([
            {path: ['name'], message: 'Name already exists'},
        ]);
        return this.repository.create(data);
    }

    async update(id: number, data: any) {
        const existing = await this.repository.findByName(data.name);
        if (existing && existing.id !== id) throw new ValidationError([
            {path: ['name'], message: 'Name already exists'},
        ]);
        return this.repository.update(id, data);
    }
}
