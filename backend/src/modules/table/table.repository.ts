import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class TableRepository extends BaseRepository<typeof prisma.category> {
    constructor() {
        super(prisma.category);
    }

    async findByName(name: string) {
        return this.model.findFirst({ where: { name } });
    }
}
