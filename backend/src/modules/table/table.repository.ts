import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class TableRepository extends BaseRepository<typeof prisma.table> {
    constructor() {
        super(prisma.table);
    }

    async findByName(name: string) {
        return this.model.findFirst({ where: { name } });
    }
}
