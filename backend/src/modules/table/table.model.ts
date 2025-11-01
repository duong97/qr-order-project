import {
    OrderScenario, Scenario,
} from "@/core/const/default";

export class TableModel {
    constructor(private table: any) {
    }

    toJSON(scenario: Scenario) {
        switch (scenario) {
            default:
                this.table.orderLink = process.env.FE_DOMAIN + '/t/' + btoa(this.table.id.toString());
                return this.table;
        }
    }

    /**
     * Danh sách các relation fetch chung khi get/update data và cần trả về thêm
     * @param scenario
     */
    static getRelations(scenario: OrderScenario) {
        switch (scenario) {
            default:
                return {};
        }
    }
}
