import { defineStore } from 'pinia'
import {ProductApi} from "@/api/ProductApi";
import Product from "@/interface/Product";

const productApi = new ProductApi();

export const useProductStore = defineStore('product', {
    state: () => {
        return {
            items: [] as Product[],
        }
    },
    actions: {
        async fetch() {
            this.items = await productApi.list();
        },
        async createOrUpdate(product: Product) {
            if (product.id) {
                return await productApi.update(product.id, product);
            } else {
                return await productApi.create(product);
            }
        },
        async delete(id: number) {
            return await productApi.delete(id);
        }
    }
})