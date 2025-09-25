import { defineStore } from 'pinia';
import { AuthApi } from "@/api/AuthApi";
import CurrentUser from "@/interface/CurrentUser";
import {StorageSerializers, useStorage} from "@vueuse/core";
import socket from "@/plugin/socket";
import {watch} from "vue";

const authApi = new AuthApi();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: useStorage<CurrentUser | null>('currentUser', null, undefined, { serializer: StorageSerializers.object }),
    }),

    actions: {
        async login(username: string, password: string) {
            const loginData = await authApi.login(username, password);
            const token = loginData.data?.token;

            if (token) {
                this.user = {
                    id: loginData.data.user?.id,
                    username,
                    token
                };
                socket.auth = {token};
                console.log('set socket auth token', token);
                return true;
            }
            return false;
        },

        logout() {
            this.user = null;
            socket.auth = {};
            console.log('delete socket auth token');
            return true;
        },

        isLoggedIn() {
            return !!this.user?.token;
        },
    }
});

// Khi thay đổi token thì reload lại socket auth
export function initAuthStoreWatcher(authStore: ReturnType<typeof useAuthStore>) {
    watch(
        () => authStore.user?.token,
        (token) => {
            if (token) {
                socket.auth = { token };
            } else {
                socket.auth = {};
            }
        },
        { immediate: true } // chạy luôn 1 lần khi app start
    );
}