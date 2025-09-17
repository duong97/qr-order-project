import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class OptionRepository extends BaseRepository<typeof prisma.option> {
    constructor() {
        super(prisma.option);
    }

    async findByName(name: string) {
        return this.model.findFirst({ where: { name } });
    }
}
