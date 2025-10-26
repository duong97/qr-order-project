import {BaseService} from '@/core/base/base.service';
import {OrderRepository} from './order.repository';
import {OrderInput} from "@/modules/order/order.validator";
import {ORDER_SCENARIOS, ORDER_STATUSES, PAYMENT_STATUSES} from "@/core/const/default";
import {OrderModel} from "@/modules/order/order.model";

export class OrderService extends BaseService<OrderRepository> {
    constructor() {
        super(new OrderRepository());
    }

    async createOrder(orderInput: OrderInput) {
        let orderDetails = [];
        for (const item of orderInput.items || []) {
            const _productId = item.id;
            const variants = item.variants;
            for (const _variant of variants || []) {
                let _orderDetail = {
                    productId: _productId,
                    qty: _variant.qty || 0,
                    price: _variant.price || 0,
                    note: _variant.note || null,
                    productOptions: _variant.itemOptions || null,
                }
                orderDetails.push(_orderDetail);
            }
        }

        const orderData = {
            code: this.generateOrderCode().toString(),
            tableId: orderInput.tableId || 1,
            note: orderInput.note || '',
            details: {
                create: orderDetails
            },
        };

        const include = OrderModel.getRelations(ORDER_SCENARIOS.LIST);
        return this.create(orderData, include);
    }

    generateOrderCode() {
        return Math.floor(10000 + Math.random() * 90000);
    }

    async confirm(orderId: number, updatedBy: number|null = null) {
        const include = OrderModel.getRelations(ORDER_SCENARIOS.LIST);
        return this.update(
            orderId,
            {
                orderStatus: ORDER_STATUSES.PROCESSING,
                updatedBy,
                version: { increment: 1 }
            },
            include
        );
    }

    async complete(orderId: number, updatedBy: number|null = null) {
        const include = OrderModel.getRelations(ORDER_SCENARIOS.LIST);
        return this.update(
            orderId,
            {
                orderStatus: ORDER_STATUSES.COMPLETED,
                paymentStatus: PAYMENT_STATUSES.PAID,
                updatedBy,
                version: { increment: 1 }
            },
            include
        );
    }

    async cancel(orderId: number, updatedBy: number|null = null) {
        const include = OrderModel.getRelations(ORDER_SCENARIOS.LIST);
        return this.update(
            orderId,
            {
                orderStatus: ORDER_STATUSES.CANCELLED,
                updatedBy,
                version: { increment: 1 }
            },
            include
        );
    }
}
