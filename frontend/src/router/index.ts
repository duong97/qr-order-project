import {createRouter, createWebHistory} from "vue-router";
import QrtHome from "@/components/QrtHome.vue";
import QrtCheckout from "@/components/QrtCheckout.vue";
import QrtLogin from "@/components/QrtLogin.vue";
import AdminHome from "@/components/admin/QrtAdminHome.vue";
import AdminOrder from "@/components/admin/QrtOrderList.vue";
import QrtNotFound from "@/components/QrtNotFound.vue";
import { useTableStore } from '@/store/TableStore';
import {useAuthStore} from "@/store/AuthStore";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: QrtHome
        },
        {
            path: '/t/:tableIdEncoded',
            name: 'setTable',
            component: QrtHome,
            beforeEnter: async (to) => {
                const tableIdEncoded = (to.params.tableIdEncoded || '') as string
                const tableId = atob(tableIdEncoded);
                const tableStore = useTableStore();
                await tableStore.initTable(tableId);
                return { name: 'home' }
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
            component: AdminHome,
        },
        {
            path: '/admin/order',
            name: 'admin-order',
            component: AdminOrder,
        },
        { path: '/:pathMatch(.*)*', component: QrtNotFound }
    ]
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const tableStore = useTableStore();

    await tableStore.initTable();

    if (!authStore.isLoggedIn && to.path.startsWith("/admin")) {
        return { name: "login" };
    }
    if (authStore.isLoggedIn && to.name === "login") {
        return { name: 'admin' }
    }
});

export default router;