export class BaseRepository<TModel> {
    protected model: TModel;

    constructor(model: TModel) {
        this.model = model;
    }

    async findAll(args?: any): Promise<any[]> {
        // @ts-ignore
        return this.model.findMany(args);
    }

    async findOne(args: any): Promise<any | null> {
        // @ts-ignore
        return this.model.findFirst(args);
    }

    async findById(id?: number): Promise<any | null> {
        if (!id) return null;
        // @ts-ignore
        return this.model.findUnique({ where: { id } });
    }

    async create(data: any, include: any = {}): Promise<any> {
        // @ts-ignore
        return this.model.create({ data, include });
    }

    async update(id: number, data: any, include: any = {}): Promise<any> {
        // @ts-ignore
        return this.model.update({ where: { id }, data, include });
    }

    async delete(id: number): Promise<any> {
        // @ts-ignore
        return this.model.delete({ where: { id } });
    }
}
