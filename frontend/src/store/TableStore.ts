import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useTableStore = defineStore('table', {
    state: () => {
        return {
            tableName: useLocalStorage('tableName', 'Khách'),
            customerName: useLocalStorage('customerName', ''),
        }
    },
    actions: {
        setName(tableName: string) {
            this.tableName = tableName;
        },
    }
})