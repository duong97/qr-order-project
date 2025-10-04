<script setup lang="ts">
import { Form, CellGroup, Field, Button, showNotify } from "vant";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/AuthStore";

// 🧩 State & store
const email = ref("");
const password = ref("");
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

// 🧭 Login handler
async function login() {
    loading.value = true;
    const isLoginSuccess = await authStore.login(email.value, password.value);
    loading.value = false;

    if (isLoginSuccess) {
        showNotify({ type: "success", message: "Đăng nhập thành công!" });
        await router.push("/admin");
    } else {
        showNotify("Sai tên tài khoản hoặc mật khẩu!");
    }
}
</script>

<template>
    <div class="m-3">
        <h1 class="title is-5">Administrator</h1>

        <Form @submit="login">
            <CellGroup inset>
                <Field
                    v-model="email"
                    name="Username"
                    label="Username"
                    placeholder="your_username"
                    autofocus
                    :rules="[{ required: true, message: 'Username không được để trống' }]"
                />
                <Field
                    v-model="password"
                    type="password"
                    name="Password"
                    label="Mật khẩu"
                    placeholder="*******"
                    :rules="[{ required: true, message: 'Mật khẩu không được để trống' }]"
                />
            </CellGroup>

            <div style="margin: 16px;">
                <Button
                    round
                    block
                    type="primary"
                    native-type="submit"
                    :disabled="loading"
                    :loading="loading"
                >
                    Đăng nhập
                </Button>
            </div>
        </Form>
    </div>
</template>

<style scoped>
</style>