import {createRouter, createWebHistory} from "vue-router";
import QrtHome from "@/components/QrtHome.vue";
import QrtCheckout from "@/components/QrtCheckout.vue";
import QrtLogin from "@/components/QrtLogin.vue";
import AdminIndex from "@/components/admin/AdIndex.vue";
import AdminOrder from "@/components/admin/AdOrder.vue";
import QrtNotFound from "@/components/QrtNotFound.vue";
import { useTableStore } from '@/store/TableStore';
import {useAuthStore} from "@/store/AuthStore";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: QrtHome,
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
            component: QrtCheckout
        },
        {
            path: '/login',
            name: 'login',
            component: QrtLogin,
            beforeEnter: () => {
                const authStore = useAuthStore();
                if (authStore.isLoggedIn) {
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
        { path: '/:pathMatch(.*)*', component: QrtNotFound }
    ]
});

router.beforeEach((to) => {
    const authStore = useAuthStore();
    const tableStore = useTableStore();

    if (!authStore.isLoggedIn && to.path.startsWith("/admin")) {
        return { name: "login" };
    }
    if (authStore.isLoggedIn && to.name === "login") {
        return { name: 'admin' }
    }

    const tableName = (to.query.table || '') as string;
    if (tableName) {
        tableStore.setName(tableName);
        return { name: 'home' }
    }
});

export default router;