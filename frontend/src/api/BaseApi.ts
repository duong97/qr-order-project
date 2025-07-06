import config from "@/config";

export class BaseApi {
    apiUrl: string;
    body: object;
    queryParams: object;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.body = {};
        this.queryParams = {};
    }

    private getOptions(extraOptions?: object) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json',
                'X-API-KEY': config.cfConfig.apiKey,
            },
        };
        return {...defaultOptions, ...extraOptions};
    }

    getQueryString(): string {
        return Object.entries(this.queryParams)
            .filter(([, value]) => value != null) // Remove null or undefined values
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
    }

    buildApiUrl() {
        return [this.apiUrl, this.getQueryString()].filter(e => e).join('?');
    }

    private call(method = 'GET') {
        const hasBody = Object.keys(this.body).length > 0;
        const formData = new FormData();
        // let overrideHeaders = {};
        if (hasBody) {
            Object.entries(this.body).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value); // If it's a file, append directly
                } else if (Array.isArray(value)) {
                    // For arrays, append each item individually
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else {
                    formData.append(key, value);
                }
            });
            // overrideHeaders = {
            //     headers: {
            //         'Content-Type': 'multipart/form-data, application/x-www-form-urlencoded'
            //     }
            // };
            // @todo fix upload file
            // for (const [key, value] of formData.entries()) {
            //     console.log(`${key}:`, value);
            // }
        }

        const rqOptions = this.getOptions({
            method,
            ...(hasBody && { body: formData }),
        });
        console.log(rqOptions)
        return fetch(
            this.buildApiUrl(),
            rqOptions
        )
            .then(res => res.json())
            .then((res) => res)
    }

    async list() {
        this.body = {};
        this.queryParams = {};
        return await this.call();
    }

    async create(data: object) {
        this.body = data;
        this.queryParams = {};
        return await this.call('POST');
    }

    async update(id: number, data: object) {
        this.body = data;
        this.queryParams = { id };
        return await this.call('POST');
    }

    async delete(id: number) {
        this.body = {};
        this.queryParams = { id };
        return await this.call('DELETE');
    }
}