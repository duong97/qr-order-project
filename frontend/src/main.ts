import 'bulma/css/bulma.css'
import 'vant/lib/index.css';
import '@/lib/animate/animate.min.css';
import '@/lib/fontawesome//css/fontawesome.css';
import '@/lib/fontawesome//css/brands.css';
import '@/lib/fontawesome//css/solid.css';
import '@/assets/css/main.css';

import { createApp } from 'vue'
import App from './App.vue'
import {formatThousand} from "@/filters/default";
import { createPinia } from 'pinia';
import router from '@/router';
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
import {authHandler} from "@/handler/AuthHandler";
import {initAuthStoreWatcher, useAuthStore} from "@/store/AuthStore";
import ConfirmDirective from '@/directives/v-confirm';

const app = createApp(App)
app.config.globalProperties.$filters = {
    formatThousand,
};

const pinia = createPinia();
app.use(pinia)
app.use(router)
app.directive('confirm', ConfirmDirective);
authHandler.init(router)
Locale.use('en-US', enUS);

// Phải đặt store bên dưới pinia
const authStore = useAuthStore();
initAuthStoreWatcher(authStore);

app.mount('#app')
