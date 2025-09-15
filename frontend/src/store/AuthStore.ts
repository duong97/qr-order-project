import { defineStore } from 'pinia';
import { AuthApi } from "@/api/AuthApi";
import CurrentUser from "@/interface/CurrentUser";
import {StorageSerializers, useStorage} from "@vueuse/core";

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
                return true;
            }
            return false;
        },

        logout() {
            this.user = null;
            return true;
        },

        isLoggedIn() {
            return !!this.user?.token;
        },
    }
});
