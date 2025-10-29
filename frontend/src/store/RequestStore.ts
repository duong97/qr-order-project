import { defineStore } from 'pinia'
import {RequestApi} from "@/api/admin/RequestApi";
import Request from "@/interface/Request";

const adminRequestApi = new RequestApi();

export const useRequestStore = defineStore('request', {
    state: () => {
        return {
            items: [] as Request[],
        }
    },
    actions: {
        async fetch() {
            this.items = await adminRequestApi.list();
        },
        async createOrUpdate(request: Request) {
            if (request.id) {
                return await adminRequestApi.update(request.id, request);
            } else {
                return await adminRequestApi.create(request);
            }
        },
        async delete(id: number) {
            return await adminRequestApi.delete(id);
        },
        addItem(item: Request) {
            this.items.unshift(item);
        },
    }
})