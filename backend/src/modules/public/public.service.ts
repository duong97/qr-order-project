import {prisma} from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {OrderInput} from "@/modules/order/order.validator";
import {getIO} from "@/lib/socket";
import {SOCKET_EVENTS, SOCKET_ROOMS} from "@/core/const/default";

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
        // @todo xử lý tổ chức socket
        // -- 1 user khi kết nối socket tới server thì dựa vào role để join room
        // -- khi emit sự kiện thì user join room đó mới nhận được
        // - to room: chỉ để quản lý, client không biết cụ thể room nào
        // - xem xét đặt tên event dạng admin-order-12
        getIO()
            .to(SOCKET_ROOMS.ORDER)
            .emit(SOCKET_EVENTS.ORDER_NEW, data);
        return data;
    }
}
