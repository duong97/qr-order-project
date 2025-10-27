import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import Table from "@/interface/Table";
import {TableApi} from "@/api/admin/TableApi";

const adminTableApi = new TableApi();

export const useTableStore = defineStore('table', {
    state: () => {
        return {
            tableName: useLocalStorage('tableName', 'Khách'),
            customerName: useLocalStorage('customerName', ''),
            items: [] as Table[],
        }
    },
    actions: {
        setName(tableName: string) {
            this.tableName = tableName;
        },
        async adminList() {
            this.items = await adminTableApi.list();
        },
        async createOrUpdate(table: Table) {
            if (table.id) {
                return await adminTableApi.update(table.id, table);
            } else {
                return await adminTableApi.create(table);
            }
        },
        async delete(id: number) {
            return await adminTableApi.delete(id);
        }
    }
})