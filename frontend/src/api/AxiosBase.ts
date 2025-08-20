import axios, {AxiosResponse} from 'axios';
import config from '@/config';

const AxiosBase = axios.create({
    baseURL: config.cfConfig.apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.cfConfig.apiKey,
    },
});

AxiosBase.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        const statusCode = error.response?.status ?? 500;
        const isValidationError = statusCode === 400;
        let firstErrorMsg = isValidationError ? error.response?.data?.errors?.[0]?.message ?? null : null;
        if (!firstErrorMsg) {
            firstErrorMsg = error.response?.data?.message || null;
        }
        return {
            data: {
                data: [],
                success: false,
                message: firstErrorMsg || "Lỗi hệ thống"
            },      // hoặc [] nếu bạn muốn dạng array
            status: statusCode,
            statusText: "error",
            headers: error.response?.headers ?? {},
            config: error.config,
        } as AxiosResponse;
    })

export default AxiosBase;
