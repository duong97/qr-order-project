import {createRouter, createWebHistory} from "vue-router";
import Home from "@/components/Home.vue";
import Checkout from "@/components/Checkout.vue";
import Login from "@/components/Login.vue";
import AdminIndex from "@/components/admin/AdIndex.vue";
import AdminOrder from "@/components/admin/AdOrder.vue";
import PageNotFound from "@/components/PageNotFound.vue";
import { useTableStore } from '@/store/TableStore';
import {useAuthStore} from "@/store/AuthStore";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            beforeEnter: (to) => {
                const tableName = (to.query.table || '') as string;
                const tableStore = useTableStore();
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
            name: 'login',
            component: Login,
            beforeEnter: () => {
                const authStore = useAuthStore();
                if (authStore.isLoggedIn()) {
                    return { path: '/admin' }
                } else {
                    return true;
                }
            }
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminIndex,
        },
        {
            path: '/admin/order',
            name: 'admin-order',
            component: AdminOrder,
        },
        { path: '/:pathMatch(.*)*', component: PageNotFound }
    ]
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();
    const tableStore = useTableStore();

    if (!authStore.isLoggedIn() && to.path.startsWith("/admin")) {
        return { name: "login" };
    }
    if (authStore.isLoggedIn() && to.name === "login") {
        return { name: 'admin' }
    }

    const tableName = (to.query.table || '') as string;
    if (tableName) {
        tableStore.setName(tableName);
        return { name: 'home' }
    }
});

export default router;