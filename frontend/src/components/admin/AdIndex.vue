<script lang="ts">
import {defineComponent} from "vue";
import {Button, showNotify, Tabs, Tab} from "vant";
import {useRouter} from "vue-router";
import QrtAdminProductList from "@/components/admin/AdProductList.vue";
import QrtAdminCategoryList from "@/components/admin/AdCategoryList.vue";
import QrtAdminProductOptionList from "@/components/admin/AdProductOptionList.vue";
import {useAuthStore} from "@/store/AuthStore";

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
        const authStore = useAuthStore();
        const router = useRouter();

        return {
            authStore,
            router,
        }
    },
    methods: {
        async logout() {
            const isLogoutSuccess = await this.authStore.logout();
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
                Đăng xuất ({{ authStore.user?.username }})
            </van-button>
        </div>
        <van-tabs animated>
            <van-tab title="Danh mục" :key="1">
                <qrt-admin-category-list />
            </van-tab>
            <van-tab title="Món ăn" :key="2">
                <qrt-admin-product-list />
            </van-tab>
            <van-tab title="Tùy chọn" :key="3">
                <qrt-admin-product-option-list />
            </van-tab>
        </van-tabs>
    </div>
</template>

<style scoped>

</style>