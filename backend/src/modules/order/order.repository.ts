import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class OrderRepository extends BaseRepository<typeof prisma.product> {
    constructor() {
        super(prisma.product);
    }

    async findByName(name: string) {
        return this.model.findFirst({ where: { name } });
    }
}
