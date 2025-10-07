import { BaseRepository } from './base.repository';

export class BaseService<TRepository extends BaseRepository<any>> {
    protected repository: TRepository;

    constructor(repository: TRepository) {
        this.repository = repository;
    }

    async getAll(args?: any) {
        return this.repository.findAll(args);
    }

    async getById(id: number) {
        return this.repository.findById(id);
    }

    async create(data: any, include: any = {}) {
        return this.repository.create(data, include);
    }

    async update(id: number, data: any, include: any = {}) {
        return this.repository.update(id, data, include);
    }

    async delete(id: number) {
        return this.repository.delete(id);
    }
}
