import { defineStore } from 'pinia'
import {OptionApi} from "@/api/admin/OptionApi";
import ProductOption from "@/interface/ProductOption";

const adminOptionApi = new OptionApi();

export const useProductOptionStore = defineStore('productOption', {
    state: () => {
        return {
            items: [] as ProductOption[],
        }
    },
    actions: {
        async fetch() {
            this.items = await adminOptionApi.list();
        },
        async createOrUpdate(productOption: ProductOption) {
            if (productOption.id) {
                return await adminOptionApi.update(productOption.id, productOption);
            } else {
                return await adminOptionApi.create(productOption);
            }
        },
        async delete(id: number) {
            return await adminOptionApi.delete(id);
        }
    }
})