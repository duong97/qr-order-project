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

    async create(data: any) {
        return this.repository.create(data);
    }

    async update(id: number, data: any) {
        return this.repository.update(id, data);
    }

    async delete(id: number) {
        return this.repository.delete(id);
    }
}
