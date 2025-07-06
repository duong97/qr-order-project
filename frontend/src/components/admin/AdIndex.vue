<script lang="ts">
import {defineComponent} from "vue";
import {Button, showNotify, Tabs, Tab} from "vant";
import {useFirebaseStore} from "@/store/FirebaseStore";
import {useRouter} from "vue-router";
import QrtAdminProductList from "@/components/admin/AdProductList.vue";
import QrtAdminCategoryList from "@/components/admin/AdCategoryList.vue";
import QrtAdminProductOptionList from "@/components/admin/AdProductOptionList.vue";

export default defineComponent({
    name: "qrt-admin-index",
    components: {
        QrtAdminProductOptionList,
        QrtAdminCategoryList,
        QrtAdminProductList,
        [Button.name]: Button,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
    },
    data() {
        return {

        }
    },
    setup() {
        const firebaseStore = useFirebaseStore();
        const router = useRouter();

        // Check login state
        firebaseStore.onAuthStateChanged((isLoggedIn) => {
            if (!isLoggedIn) {
                router.push('/login');
            }
        })

        return {
            firebaseStore,
            router,
        }
    },
    methods: {
        async logout() {
            const isLogoutSuccess = await this.firebaseStore.logout();
            if (isLogoutSuccess) {
                showNotify({ type: 'success', message: "Đã đăng xuất!"});
                await this.router.push({path: '/login'});
            } else {
                showNotify({ type: 'danger', message: "Có lỗi xảy ra!"});
            }
        }
    }
})
</script>

<template>
    <div id="admin-index-container">
        <div class="is-display-flex is-justify-content-center is-align-items-center">
            <span class="title is-3 m-2">
                Quản lý
            </span>
            <van-button
                round
                size="mini"
                type="danger"
                native-type="submit"
                @click="logout"
            >
                Đăng xuất
            </van-button>
        </div>
        <van-tabs animated>
            <van-tab title="Nhóm" :key="1">
                <qrt-admin-category-list />
            </van-tab>
            <van-tab title="Topping/Tùy chọn" :key="2">
                <qrt-admin-product-option-list />
            </van-tab>
            <van-tab title="Món" :key="3">
                <qrt-admin-product-list />
            </van-tab>
        </van-tabs>
    </div>
</template>

<style scoped>

</style>