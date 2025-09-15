import axios from 'axios';
import config from '@/config';

/**
 * Class này sử dụng cho các API AUTH
 * Không dùng chung với axios base do trong base có xử lý bắt request status 401 để logout
 * Nên nếu auth dùng axios base sẽ bị vòng lặp
 * Axios base -> call authStore để logout -> trong authStore có use api -> api có axios -> axios lại call interceptors -> infinite loop
 */
const AuthAxios = axios.create({
    baseURL: config.cfConfig.apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.cfConfig.apiKey,
    },
});

export default AuthAxios;
