import { BaseRepository } from '@/core/base/base.repository';
import { prisma } from '@/lib/prisma';

export class OrderRepository extends BaseRepository<typeof prisma.order> {
    constructor() {
        super(prisma.order);
    }
}
