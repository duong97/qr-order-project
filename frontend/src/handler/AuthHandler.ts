import {useAuthStore} from "@/store/AuthStore";
import type { Router } from "vue-router";

class AuthHandler {
    private router: Router | null = null;

    init(router: Router) {
        this.router = router;
    }

    handleUnauthorized() {
        const authStore = useAuthStore();
        authStore.logout();
        if (this.router) {
            this.router.push({ name: "login" });
        }
    }
}

export const authHandler = new AuthHandler();