import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class RequestRepository extends BaseRepository<typeof prisma.request> {
    constructor() {
        super(prisma.request);
    }
}
