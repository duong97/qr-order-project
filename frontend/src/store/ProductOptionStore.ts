import { defineStore } from 'pinia'
import {ProductOptionApi} from "@/api/ProductOptionApi";
import ProductOption from "@/interface/ProductOption";

const productOptionApi = new ProductOptionApi();

export const useProductOptionStore = defineStore('productOption', {
    state: () => {
        return {
            items: [] as ProductOption[],
        }
    },
    actions: {
        async fetch() {
            // this.items = await productOptionApi.list();
        },
        async createOrUpdate(productOption: ProductOption) {
            if (productOption.id) {
                return await productOptionApi.update(productOption.id, productOption);
            } else {
                return await productOptionApi.create(productOption);
            }
        },
        async delete(id: number) {
            return await productOptionApi.delete(id);
        }
    }
})