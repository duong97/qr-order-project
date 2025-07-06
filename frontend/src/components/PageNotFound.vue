<script lang="ts">
import {
    Empty,
    Button,
} from 'vant';
import {defineComponent} from 'vue';

export default defineComponent({
    name: "qrt-page-not-found",
    components: {
        [Empty.name]: Empty,
        [Button.name]: Button,
    },
    data() {
        return {
        }
    },
})
</script>

<template>
    <van-empty
        description="Page not found!"
    />

    <div class="p-1">
        <router-link :to="{ path: '/' }">
            <van-button type="primary" block>
                Trang chủ
            </van-button>
        </router-link>
    </div>
</template>

<style scoped>
</style>