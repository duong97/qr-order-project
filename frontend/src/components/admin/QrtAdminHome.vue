<script setup lang="ts">
import { Button, showNotify, Tabs, Tab } from "vant";
import { useRouter } from "vue-router";
import QrtAdminProductList from "@/components/admin/QrtProductList.vue";
import QrtAdminCategoryList from "@/components/admin/QrtCategoryList.vue";
import QrtAdminProductOptionList from "@/components/admin/QrtProductOptionList.vue";
import QrtTableList from "@/components/admin/QrtTableList.vue";
import { useAuthStore } from "@/store/AuthStore";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
    const isLogoutSuccess = await authStore.logout();
    if (isLogoutSuccess) {
        showNotify({ type: "success", message: "Đã đăng xuất!" });
        await router.push({ path: "/login" });
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
    }
};
</script>

<template>
    <div id="admin-index-container">
        <div class="is-display-flex is-justify-content-center is-align-items-center">
            <span class="title is-3 m-2">Quản lý</span>
            <Button
                round
                size="mini"
                type="danger"
                native-type="submit"
                @click="logout"
            >
                Đăng xuất ({{ authStore.user?.username }})
            </Button>
        </div>

        <Tabs animated>
            <Tab title="Danh mục" :key="1">
                <QrtAdminCategoryList />
            </Tab>
            <Tab title="Món ăn" :key="2">
                <QrtAdminProductList />
            </Tab>
            <Tab title="Tùy chọn" :key="3">
                <QrtAdminProductOptionList />
            </Tab>
            <Tab title="Bàn" :key="4">
                <QrtTableList />
            </Tab>
        </Tabs>
    </div>
</template>

<style scoped></style>
