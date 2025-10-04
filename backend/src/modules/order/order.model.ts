import {ORDER_STATUS_LABELS, ORDER_STATUSES, OrderScenario} from "@/core/const/default";

export class OrderModel {
    constructor(private order: any) {
    }

    toJSON(scenario: OrderScenario) {
        switch (scenario) {
            default:
                // list
                this.order.orderStatusLabel = ORDER_STATUS_LABELS[this.order.orderStatus || ORDER_STATUSES.NEW] || 'Unknown';
                // status
                this.order.isNew = this.order.orderStatus === ORDER_STATUSES.NEW || this.order.orderStatus === null;
                this.order.isProcessing = this.order.orderStatus === ORDER_STATUSES.PROCESSING;
                this.order.isCompleted = this.order.orderStatus === ORDER_STATUSES.COMPLETED;
                this.order.isCancelled = this.order.orderStatus === ORDER_STATUSES.CANCELLED;
                // validate action
                this.order.canComplete = this.order.isNew || this.order.isProcessing;
                this.order.canCancel = this.order.isNew || this.order.isProcessing;

                return this.order;
        }
    }

    /**
     * Danh sách các relation fetch chung khi get/update data và cần trả về thêm
     * @param scenario
     */
    static getRelations(scenario: OrderScenario) {
        switch (scenario) {
            default:
                return {
                    details: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    thumbnail: true,
                                },
                            },
                        }
                    },
                    table: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    }
                };
        }
    }
}
