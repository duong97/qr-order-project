import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {OrderInput} from "@/modules/order/order.validator";

export class PublicService {
    protected product: Prisma.ProductDelegate;
    protected category: Prisma.CategoryDelegate;
    protected order: Prisma.OrderDelegate;

    constructor() {
        this.product = prisma.product;
        this.category = prisma.category;
        this.order = prisma.order;
    }

    async products(data: any) {
        return this.product.findMany(data);
    }

    async categories(data: any) {
        return this.category.findMany(data);
    }

    async submitOrder(data: OrderInput) {
        console.log('order received', data)
        return data;
    }
}
