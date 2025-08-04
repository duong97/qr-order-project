import { defineStore } from 'pinia'
import {CategoryApi} from "@/api/CategoryApi";
import Category from "@/interface/Category";

const categoryApi = new CategoryApi();

export const useCategoryStore = defineStore('category', {
    state: () => {
        return {
            items: [] as Category[],
        }
    },
    actions: {
        async fetch() {
            this.items = await categoryApi.list();
            console.log('categories: ', this.items)
        },
        async createOrUpdate(category: Category) {
            if (category.id) {
                return await categoryApi.update(category.id, category);
            } else {
                return await categoryApi.create(category);
            }
        },
        async delete(id: number) {
            return await categoryApi.delete(id);
        }
    }
})