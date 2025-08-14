import Api from "@/api/Api";

export class BaseApi {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async list() {
        const response = await Api.get(this.path);
        return response.data.data;
    }

    async create(data: object) {
        const response = await Api.post(this.path, data);
        return response.data.data;
    }

    async update(id: number, data: object) {
        const response = await Api.post(this.path + '/' + id, data);
        return response.data.data;
    }

    async delete(id: number) {
        const response = await Api.delete(this.path + '/' + id);
        return response.data.data;
    }
}