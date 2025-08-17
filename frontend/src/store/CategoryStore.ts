import { defineStore } from 'pinia'
import {CategoryApi} from "@/api/admin/CategoryApi";
import Category from "@/interface/Category";
import {PublicApi} from "@/api/public/PublicApi";

const publicApi = new PublicApi();
const adminCategoryApi = new CategoryApi();

export const useCategoryStore = defineStore('category', {
    state: () => {
        return {
            items: [] as Category[],
        }
    },
    actions: {
        async fetch() {
            this.items = await publicApi.categories();
        },
        async createOrUpdate(category: Category) {
            if (category.id) {
                return await adminCategoryApi.update(category.id, category);
            } else {
                return await adminCategoryApi.create(category);
            }
        },
        async delete(id: number) {
            return await adminCategoryApi.delete(id);
        }
    }
})