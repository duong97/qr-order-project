import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {OrderInput} from "@/modules/order/order.validator";
import {getIO} from "@/lib/socket";
import {SOCKET_EVENTS, SOCKET_ROOMS} from "@/core/const/default";
import {OrderService} from "@/modules/order/order.service";

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
        const orderService = new OrderService();
        const orderCreated = orderService.createOrder(data);
        getIO()
            .to(SOCKET_ROOMS.ORDER)
            .emit(SOCKET_EVENTS.ORDER_NEW, orderCreated);
        return orderCreated;
    }
}
