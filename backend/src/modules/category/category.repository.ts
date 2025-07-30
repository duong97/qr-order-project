import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class CategoryRepository extends BaseRepository<typeof prisma.category> {
    constructor() {
        super(prisma.category);
    }

    async findByName(name: string) {
        return prisma.category.findFirst({ where: { name } });
    }
}
