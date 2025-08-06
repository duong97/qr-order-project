import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class UserRepository extends BaseRepository<typeof prisma.user> {
    constructor() {
        super(prisma.user);
    }

    async findByUsername(username: string) {
        return this.model.findFirst({ where: { username } });
    }
}
