import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import Table from "@/interface/Table";
import {TableApi} from "@/api/admin/TableApi";

const adminTableApi = new TableApi();

export const useTableStore = defineStore('table', {
    state: () => {
        return {
            tableName: useLocalStorage('tableName', 'Khách' as string),
            customerName: useLocalStorage('customerName', ''),
            items: [] as Table[],
            currentTable: useLocalStorage('currentTable', {} as Table),
        }
    },
    actions: {
        setName(tableName: string) {
            this.tableName = tableName;
        },
        initTable(hash?: string) {
            if (!this.currentTable?.id) {
                this.currentTable = {
                    id: 1,
                    name: "Kênh online",
                    code: "K-OL",
                }
                this.tableName = this.currentTable?.name || '';
            }
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