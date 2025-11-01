import {BaseService} from '@/core/base/base.service';
import {TableRepository} from './table.repository';
import {ValidationError} from "@/core/middleware/errorHandler";

export class TableService extends BaseService<TableRepository> {
    constructor() {
        super(new TableRepository());
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

    async getTableDefault() {
        const tableDefault = await this.repository.findTableDefault();
        if (!tableDefault) {
            return await this.repository.findOne({});
        }
        return tableDefault;
    }
}
