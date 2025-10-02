import {BaseService} from '@/core/base/base.service';
import {OrderRepository} from './order.repository';
import {OrderInput} from "@/modules/order/order.validator";
import {ORDER_STATUSES, PAYMENT_STATUSES} from "@/core/const/default";

export class OrderService extends BaseService<OrderRepository> {
    constructor() {
        super(new OrderRepository());
    }

    async create(data: any) {
        return this.repository.create(data);
    }

    async update(id: number, data: any) {
        return this.repository.update(id, data);
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

                console.log('orderDetail: ', _variant.itemOptions);
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

        console.log('create order data: ', {
            data: orderData,
            include: {
                details: true
            }
        })
        return this.repository.create(orderData, { details: true });
    }

    generateOrderCode() {
        return Math.floor(10000 + Math.random() * 90000);
    }

    async confirm(id: number) {
        return this.repository.update(id, { orderStatus: ORDER_STATUSES.PROCESSING });
    }

    async complete(id: number) {
        return this.repository.update(id, { orderStatus: ORDER_STATUSES.COMPLETED, paymentStatus: PAYMENT_STATUSES.PAID });
    }

    async cancel(id: number) {
        return this.repository.update(id, { orderStatus: ORDER_STATUSES.CANCELLED });
    }
}
