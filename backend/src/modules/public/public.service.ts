import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {OrderInput} from "@/modules/order/order.validator";
import {getIO} from "@/lib/socket";
import {ORDER_SCENARIOS, REQUEST_SCENARIOS, SCENARIOS, SOCKET_EVENTS, SOCKET_ROOMS} from "@/core/const/default";
import {OrderService} from "@/modules/order/order.service";
import {OrderModel} from "@/modules/order/order.model";
import {CreateRequestInput} from "@/modules/request/request.validator";
import {RequestService} from "@/modules/request/request.service";
import {RequestModel} from "@/modules/request/request.model";
import {TableService} from "@/modules/table/table.service";
import {TableModel} from "@/modules/table/table.model";

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
        const requestModel = new RequestModel(requestCreated);
        const requestFormatted = requestModel.toJSON(REQUEST_SCENARIOS.LIST);
        getIO()
            .to(SOCKET_ROOMS.REQUEST)
            .emit(SOCKET_EVENTS.REQUEST_NEW, requestFormatted);
        return requestFormatted;
    }

    async getTableById(id?: number) {
        if (!id) return null;
        const tableService = new TableService();
        const table = await tableService.getById(id);
        const tableModel = new TableModel(table);
        return tableModel.toJSON(SCENARIOS.LIST);
    }

    async getTableDefault() {
        const tableService = new TableService();
        const table = await tableService.getTableDefault();
        if (!table) {
            return null;
        }
        const tableModel = new TableModel(table);
        return tableModel.toJSON(SCENARIOS.LIST);
    }
}
