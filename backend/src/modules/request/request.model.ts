import {
    OrderScenario,
    REQUEST_STATUS_LABELS,
    REQUEST_STATUSES, REQUEST_TYPE_LABELS, REQUEST_TYPES,
    RequestScenario
} from "@/core/const/default";

export class RequestModel {
    constructor(private request: any) {
    }

    toJSON(scenario: RequestScenario) {
        switch (scenario) {
            default:
                this.request.statusLabel = REQUEST_STATUS_LABELS[this.request.status || REQUEST_STATUSES.NEW] || 'Unknown';
                this.request.typeLabel = REQUEST_TYPE_LABELS[this.request.type || REQUEST_TYPES.CALL_STAFF] || 'Unknown';
                return this.request;
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
