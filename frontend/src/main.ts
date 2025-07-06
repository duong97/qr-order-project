import 'bulma/css/bulma.css'
import 'vant/lib/index.css';
import '@/lib/animate/animate.min.css';
import '@/lib/fontawesome//css/fontawesome.css';
import '@/lib/fontawesome//css/brands.css';
import '@/lib/fontawesome//css/solid.css';
import '@/assets/css/main.css';

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/components/Home.vue";
import Checkout from "@/components/Checkout.vue";
import PageNotFound from "@/components/PageNotFound.vue";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/admin/AdIndex.vue";
import {formatThousand} from "@/filters/default";
import { createPinia } from 'pinia';

const app = createApp(App)
app.config.globalProperties.$filters = {
    formatThousand,
};

app.use(createPinia())

import { useTableStore } from '@/store/TableStore';
import { useFirebaseStore } from '@/store/FirebaseStore';
const tableStore = useTableStore();
const firebaseStore = useFirebaseStore();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
            beforeEnter: (to) => {
                const tableName = (to.query.table || '') as string;
                if (tableName) {
                    tableStore.setName(tableName);
                    return { path: '/' }
                } else {
                    return true;
                }
            },
        },
        {
            path: '/checkout',
            component: Checkout
        },
        {
            path: '/login',
            component: Login,
            beforeEnter: () => {
                if (firebaseStore.isLoggedIn()) {
                    return { path: '/admin' }
                } else {
                    return true;
                }
            }
        },
        {
            path: '/admin',
            component: AdminIndex,
            beforeEnter: () => {
                if (firebaseStore.isLoggedIn()) {
                    return true;
                } else {
                    return { path: '/login' }
                }
            }
        },
        { path: '/:pathMatch(.*)*', component: PageNotFound }
    ]
});
app.use(router)

import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
Locale.use('en-US', enUS);

app.mount('#app')
