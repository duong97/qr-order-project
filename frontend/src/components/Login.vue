<script lang="ts">
import {Form, CellGroup, Field, Button, showNotify} from "vant";
import {defineComponent, ref} from "vue";
import { useRouter } from 'vue-router';
import {useFirebaseStore} from "@/store/FirebaseStore";

export default defineComponent({
    name: "qrt-login",
    components: {
        [Form.name]: Form,
        [CellGroup.name]: CellGroup,
        [Field.name]: Field,
        [Button.name]: Button,
    },
    setup() {
        const email = ref("");
        const password = ref("");
        const loading = ref(false);
        const firebaseStore = useFirebaseStore();
        const router = useRouter();

        // Check login state
        firebaseStore.onAuthStateChanged((isLoggedIn) => {
            if (isLoggedIn) {
                router.push('/admin');
            }
        })

        return {
            email,
            password,
            firebaseStore,
            loading,
            router,
        };
    },
    methods: {
        async login() {
            this.loading = true;
            const isLoginSuccess = await this.firebaseStore.login(this.email, this.password);
            this.loading = false;

            if (isLoginSuccess) {
                showNotify({ type: 'success', message: "Đăng nhập thành công!"});
                await this.router.push('/admin');
            } else {
                showNotify("Sai tên tài khoản hoặc mật khẩu!");
            }
        },
    },
});
</script>

<template>
    <div class="m-3">
        <h1 class="title is-5">Đăng nhập vào chức năng quản lý</h1>
        <van-form @submit="login()">
            <van-cell-group inset>
                <van-field
                    v-model="email"
                    name="Email"
                    label="Email"
                    placeholder="example@gmail.com"
                    autofocus
                    :rules="[{ required: true, message: 'Email không được để trống' }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="Password"
                    label="Mật khẩu"
                    placeholder="*******"
                    :rules="[{ required: true, message: 'Mật khẩu không được để trống' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button
                    round block
                    type="primary"
                    native-type="submit"
                    :disabled="loading"
                    :loading="loading"
                >
                    Đăng nhập
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<style scoped>

</style>