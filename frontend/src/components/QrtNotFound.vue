<script setup lang="ts">
import { Empty, Button } from 'vant';
</script>

<template>
    <Empty description="Page not found!" />
    <div class="p-1">
        <router-link to="/">
            <Button type="primary" block>Trang chủ</Button>
        </router-link>
    </div>
</template>

<style scoped></style>
