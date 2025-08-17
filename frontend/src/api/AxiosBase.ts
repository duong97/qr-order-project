import axios from 'axios';
import config from '@/config';

const AxiosBase = axios.create({
    baseURL: config.cfConfig.apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.cfConfig.apiKey,
    },
});

export default AxiosBase;
