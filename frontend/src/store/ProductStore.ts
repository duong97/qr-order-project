import { defineStore } from 'pinia'
import {ProductApi} from "@/api/admin/ProductApi";
import Product from "@/interface/Product";
import {PublicApi} from "@/api/public/PublicApi";

const publicApi = new PublicApi();
const adminProductApi = new ProductApi();

export const useProductStore = defineStore('product', {
    state: () => {
        return {
            items: [] as Product[],
        }
    },
    actions: {
        async fetch() {
            this.items = await publicApi.products();
        },
        async createOrUpdate(product: Product) {
            if (product.id) {
                return await adminProductApi.update(product.id, product);
            } else {
                return await adminProductApi.create(product);
            }
        },
        async delete(id: number) {
            return await adminProductApi.delete(id);
        }
    }
})