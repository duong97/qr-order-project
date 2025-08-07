import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";

export class PublicService {
    protected product: Prisma.ProductDelegate;
    protected category: Prisma.CategoryDelegate;

    constructor() {
        this.product = prisma.product;
        this.category = prisma.category;
    }

    async products(data: any) {
        return this.product.findMany(data);
    }

    async categories(data: any) {
        return this.category.findMany(data);
    }
}
