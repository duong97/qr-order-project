import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class ProductRepository extends BaseRepository<typeof prisma.product> {
    constructor() {
        super(prisma.product);
    }

    async findByName(name: string) {
        return prisma.product.findFirst({ where: { name } });
    }
}
