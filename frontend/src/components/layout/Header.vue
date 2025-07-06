<script>
import {ConfigProvider, Tag, Switch, Icon} from 'vant'
import {useTableStore} from "@/store/TableStore";

export default {
    name: 'qrt-header',
    data() {
        return {
            isActive: false,
            theme: null,
            isShowBannerWelcome: true, // can toggle show hide
            isHideBannerOnInit: false, // hide when reload page
            tableStore: useTableStore(),
            isDarkTheme: false,
        }
    },
    components: {
        [ConfigProvider.name]: ConfigProvider,
        [Tag.name]: Tag,
        [Switch.name]: Switch,
        [Icon.name]: Icon,
    },
    props: [
    ],
    mounted() {
        // init theme
        this.theme = localStorage.getItem('theme') || 'light';
        this.isDarkTheme = this.theme === 'dark';
        this.setTheme();

        // Init show banner status
        this.isHideBannerOnInit = sessionStorage.getItem("isHideBannerOnInit") === 'true';
        this.isShowBannerWelcome = !this.isHideBannerOnInit;

        // Hide menu when click outside navbar
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            this.theme = this.isDarkTheme ? 'dark' : 'light';
            this.setTheme()
        },
        setTheme() {
            localStorage.setItem('theme', this.theme);
            document.documentElement.setAttribute('data-theme', this.theme);
        },
        setHideBannerStatus() {
            sessionStorage.setItem('isHideBannerOnInit', (!this.isShowBannerWelcome).toString());
        },
        handleClickOutside(event) {
            if (this.$refs.navbar && !this.$refs.navbar.contains(event.target)) {
                // Hide menu when click outside navbar
                this.isActive = false;
            }
        },
        toggleBannerWelcome() {
            this.isShowBannerWelcome = !this.isShowBannerWelcome;
            if (this.isShowBannerWelcome) {
                this.isHideBannerOnInit = false;
            }
            this.setHideBannerStatus();
        },
    }
};
</script>

<template>
    <!-- Vant UI theme config -->
    <van-config-provider :theme="theme"></van-config-provider>

    <!-- BEGIN nav bar -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                <img src="/images/icon.svg" alt="">
            </a>

            <a role="button" class="navbar-burger" :class="{ 'is-active': isActive }" @click="isActive = !isActive" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <Transition enter-active-class="animate__fadeInDown" leave-active-class="animate__fadeOutDown" :duration="{ enter: 500, leave: 800 }">
            <div id="navbarBasicExample" class="navbar-menu animate__animated animate__faster"
                 :class="{ 'is-active': isActive }">
                <div class="navbar-end">
                    <a class="navbar-item">Giới thiệu</a>
                    <a class="navbar-item" @click="toggleTheme">
                        <div style="display: flex; align-items: center;">
                            Giao diện &nbsp;
                            <van-switch
                                v-model="isDarkTheme"
                                inactive-color="#ffcc1e"
                                active-color="#717171"
                                size="1em"
                                @change="toggleTheme"
                            >
                                <template #node>
                                    <i class="fa-regular fa-xs"
                                       :class="isDarkTheme ? 'fa-moon' : 'fa-sun'"
                                       style="position: absolute; top: 0.6em; left: 0.15em;"
                                    ></i>
                                </template>
                            </van-switch>
                        </div>
                    </a>
                    <a class="navbar-item" @click="toggleBannerWelcome">Hiện trang welcome</a>
                </div>
            </div>
        </Transition>
    </nav>
    <!-- END nav bar -->

    <!-- BEGIN Welcome banner -->
    <div class="popup-welcome-overlay animate__animated"
         v-if="!isHideBannerOnInit"
         :class="{
            animate__backInUp: isShowBannerWelcome,
            animate__backOutUp: !isShowBannerWelcome,
            my_animate_delay: !isShowBannerWelcome
        }">
        <div class="popup-welcome-container has-text-centered animate__animated py-3" :class="{animate__bounceInDown: isShowBannerWelcome, animate__bounceOutDown: !isShowBannerWelcome}">
            <p>Số bàn của bạn là</p>
            <h1 class="title-margin-top title is-3 animate__animated animate__heartBeat animate__infinite">
                <van-tag size="large" plain type="warning">{{ tableStore.tableName }}</van-tag>
            </h1>
            <p class="mb-3">Cảm ơn bạn đã chọn chúng tôi!<br>
                Sự hài lòng của bạn là niềm vui của chúng tôi!</p>

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
    animation-delay: .8s
}
</style>