import axios from 'axios';
import config from '@/config';
import {useAuthStore} from "@/store/AuthStore"; // file config API_KEY, baseUrl...

const Api = axios.create({
    baseURL: config.cfConfig.apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.cfConfig.apiKey,
    },
});

// Interceptor thêm token vào request
Api.interceptors.request.use((req) => {
    const authStore = useAuthStore();
    if (authStore.user) {
        req.headers.Authorization = `Bearer ${authStore.user.token}`;
    }
    return req;
});

export default Api;
