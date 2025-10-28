import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {OrderInput} from "@/modules/order/order.validator";
import {getIO} from "@/lib/socket";
import {ORDER_SCENARIOS, SOCKET_EVENTS, SOCKET_ROOMS} from "@/core/const/default";
import {OrderService} from "@/modules/order/order.service";
import {OrderModel} from "@/modules/order/order.model";
import {CreateRequestInput} from "@/modules/request/request.validator";
import {RequestService} from "@/modules/request/request.service";

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
        const orderCreated = await orderService.createOrder(data);
        const orderModel = new OrderModel(orderCreated);
        const orderFormatted = orderModel.toJSON(ORDER_SCENARIOS.LIST);
        getIO()
            .to(SOCKET_ROOMS.ORDER)
            .emit(SOCKET_EVENTS.ORDER_NEW, orderFormatted);
        return orderFormatted;
    }

    async createRequest(data: CreateRequestInput) {
        const requestService = new RequestService();
        const requestCreated = await requestService.create(data);
        getIO()
            .to(SOCKET_ROOMS.REQUEST)
            .emit(SOCKET_EVENTS.REQUEST_NEW, requestCreated);
        return true;
    }
}
