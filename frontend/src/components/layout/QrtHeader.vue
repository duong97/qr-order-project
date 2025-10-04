<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { ConfigProvider, Tag, Switch } from "vant";
import { useTableStore } from "@/store/TableStore";
import { useAuthStore } from "@/store/AuthStore";

// Store
const tableStore = useTableStore();
const authStore = useAuthStore();

// State
const isActive = ref(false);
const theme = ref(localStorage.getItem("theme") || "light");
const isDarkTheme = ref(theme.value === "dark");
const isShowBannerWelcome = ref(true);
const isHideBannerOnInit = ref(false);

// Computed
const isLogin = computed(() => authStore.isLoggedIn);

// Methods
function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value;
    theme.value = isDarkTheme.value ? "dark" : "light";
    setTheme();
}

function setTheme() {
    localStorage.setItem("theme", theme.value);
    document.documentElement.setAttribute("data-theme", theme.value);
}

function toggleBannerWelcome() {
    isShowBannerWelcome.value = !isShowBannerWelcome.value;
    if (isShowBannerWelcome.value) {
        isHideBannerOnInit.value = false;
    }
    setHideBannerStatus();
}

function setHideBannerStatus() {
    sessionStorage.setItem(
        "isHideBannerOnInit",
        (!isShowBannerWelcome.value).toString()
    );
}

function handleClickOutside(event: MouseEvent) {
    const navbar = document.querySelector(".navbar");
    if (navbar && !navbar.contains(event.target as Node)) {
        isActive.value = false;
    }
}

// Lifecycle
onMounted(() => {
    setTheme();

    // Init banner
    isHideBannerOnInit.value =
        sessionStorage.getItem("isHideBannerOnInit") === "true";
    isShowBannerWelcome.value = !isHideBannerOnInit.value;

    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

// Watch login state để phản ứng UI nếu logout
watch(
    () => authStore.user,
    () => {
        // reactive tự động, không cần thêm gì
    }
);
</script>

<template>
    <!-- Vant UI theme config -->
    <ConfigProvider :theme="theme" />

    <!-- BEGIN nav bar -->
    <nav class="navbar" role="navigation" aria-label="main navigation" ref="navbar">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img src="/images/icon.svg" alt="" />
            </a>

            <a
                role="button"
                class="navbar-burger"
                :class="{ 'is-active': isActive }"
                @click="isActive = !isActive"
                aria-label="menu"
                aria-expanded="false"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <Transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOutDown"
            :duration="{ enter: 500, leave: 800 }"
        >
            <div
                id="navbarBasicExample"
                class="navbar-menu animate__animated animate__faster"
                :class="{ 'is-active': isActive }"
            >
                <div class="navbar-end">
                    <router-link class="navbar-item" to="/">Home</router-link>
                    <a class="navbar-item">Giới thiệu</a>

                    <a class="navbar-item" @click="toggleTheme">
                        <div style="display: flex; align-items: center;">
                            Giao diện &nbsp;
                            <Switch
                                v-model="isDarkTheme"
                                inactive-color="#ffcc1e"
                                active-color="#717171"
                                size="1em"
                                @change="toggleTheme"
                            >
                                <template #node>
                                    <i
                                        class="fa-regular fa-xs"
                                        :class="isDarkTheme ? 'fa-moon' : 'fa-sun'"
                                        style="position: absolute; top: 0.6em; left: 0.15em;"
                                    ></i>
                                </template>
                            </Switch>
                        </div>
                    </a>

                    <a class="navbar-item" @click="toggleBannerWelcome">
                        Hiện trang welcome
                    </a>

                    <router-link v-if="isLogin" class="navbar-item" to="/admin">Quản lý</router-link>
                    <router-link v-if="isLogin" class="navbar-item" to="/admin/orders">Đơn hàng</router-link>
                </div>
            </div>
        </Transition>
    </nav>
    <!-- END nav bar -->

    <!-- BEGIN Welcome banner -->
    <div
        class="popup-welcome-overlay animate__animated"
        v-if="!isHideBannerOnInit"
        :class="{
      animate__backInUp: isShowBannerWelcome,
      animate__backOutUp: !isShowBannerWelcome,
      my_animate_delay: !isShowBannerWelcome
    }"
    >
        <div
            class="popup-welcome-container has-text-centered animate__animated py-3"
            :class="{
        animate__bounceInDown: isShowBannerWelcome,
        animate__bounceOutDown: !isShowBannerWelcome
      }"
        >
            <p>Số bàn của bạn là</p>
            <h1
                class="title-margin-top title is-3 animate__animated animate__heartBeat animate__infinite"
            >
                <Tag size="large" plain type="warning">
                    {{ tableStore.tableName }}
                </Tag>
            </h1>
            <p class="mb-3">
                Cảm ơn bạn đã chọn chúng tôi!<br />
                Sự hài lòng của bạn là niềm vui của chúng tôi!
            </p>

            <button class="button is-primary mt-3" @click="toggleBannerWelcome">
                <span>Chọn món ngay</span>
            </button>
        </div>
    </div>
    <!-- END Welcome banner -->
</template>

<style scoped>
.popup-welcome-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    width: 100%;
    height: 100%;
    color: var(--bulma-text);
    background-color: var(--bulma-background);
}
.popup-welcome-container {
    position: absolute;
    top: 30%;
    left: 0;
    width: 100%;
}
.title-margin-top {
    margin-top: var(--bulma-block-spacing);
}
.my_animate_delay {
    animation-delay: 0.8s;
}
</style>
