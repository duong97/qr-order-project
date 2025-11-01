import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import Table from "@/interface/Table";
import {TableApi} from "@/api/admin/TableApi";
import {PublicApi} from "@/api/public/PublicApi";

const adminTableApi = new TableApi();
const publicApi = new PublicApi();

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
        setTableName(tableName: string) {
            this.tableName = tableName;
        },
        setTable(table?: Table) {
            if (table) {
                this.currentTable = table;
                this.setTableName(this.currentTable.name || 'DF')
            }
        },
        async initTable(tableId?: string) {
            if (tableId) {
                const _table = await publicApi.getTableById(+tableId);
                this.setTable(_table.data);
            } else if (!this.currentTable?.id) {
                const _table = await publicApi.getTableDefault();
                this.setTable(_table.data);
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