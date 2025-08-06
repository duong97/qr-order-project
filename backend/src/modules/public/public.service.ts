import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";

export class PublicService {
    protected product: Prisma.ProductDelegate;

    constructor() {
        this.product = prisma.product;
    }

    async products(data: any) {
        return this.product.findMany(data);
    }
}
