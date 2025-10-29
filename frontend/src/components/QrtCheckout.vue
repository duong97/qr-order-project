<script setup lang="ts">
import config from '@/config';
import {
    Button,
    NavBar,
    Row,
    Col,
    Sticky,
    Divider,
    Empty,
    Tag,
    CellGroup,
    Field,
    showDialog,
} from 'vant';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/CartStore';
import { useTableStore } from '@/store/TableStore';
import type CartItem from '@/interface/CartItem';
import type Product from '@/interface/Product';

const cartStore = useCartStore();
const tableStore = useTableStore();
const router = useRouter();

const loading = ref(false);
const cartItems = computed<CartItem[]>(() => cartStore.items || []);

function getItemById(id: number): Product | undefined {
    return config.db.products.find((i) => i.id === id);
}

async function checkout() {
    if (!tableStore.customerName) {
        await showDialog({ message: 'Vui lòng nhập họ tên!', confirmButtonText: 'OK' });
        return;
    }
    if (!cartStore.hasItems()) {
        return router.push({ path: '/' });
    }

    loading.value = true;
    const isCheckoutSuccess = await cartStore.submitOrder(
        tableStore.tableName,
        tableStore.customerName
    );
    loading.value = false;

    const message = isCheckoutSuccess
        ? 'Đơn hàng của bạn đã được gửi đi, vui lòng đợi xác nhận!'
        : 'Có lỗi khi gửi đơn hàng, vui lòng thử lại!';

    showDialog({ message, confirmButtonText: 'OK' }).then(() => {
        if (isCheckoutSuccess) router.push({ path: '/' });
    });
}
</script>

<template>
    <Sticky :offset-top="0" position="top">
        <NavBar
            left-text="Back"
            left-arrow
            @click-left="router.push({ path: '/' })"
            :left-disabled="loading"
        >
            <template #title>
                Checkout <Tag size="large" plain type="warning">{{ tableStore.tableName }}</Tag>
            </template>
        </NavBar>
    </Sticky>

    <div class="content">
        <CellGroup inset class="mt-2">
            <Field
                v-model="tableStore.customerName"
                label="Họ tên"
                :error-message="tableStore.customerName ? '' : 'Vui lòng nhập họ tên'"
                placeholder="Khách"
            />
        </CellGroup>

        <div v-for="cartItem in cartItems" :key="cartItem.id">
            <div v-for="cartVariant in cartItem.variants" :key="cartVariant.id">
                <div class="box m-3">
                    <div>
                        <span class="title is-5">{{ getItemById(cartItem.id)?.name }}</span>
                        <div v-for="cartItemOption in cartVariant.itemOptions" :key="cartItemOption.id">
                            <div class="is-size-7">
                                <p>
                                    <b>{{ cartItemOption.name }}:</b>
                                    {{ cartItemOption.items.map((i) => i.name).join(', ') }}
                                </p>
                            </div>
                        </div>
                        <p v-if="cartVariant.note"><b>Ghi chú:</b> {{ cartVariant.note }}</p>
                    </div>

                    <Divider />

                    <Row justify="space-around" class="has-text-weight-bold">
                        <Col span="10" class="has-text-left">SL: {{ cartVariant.qty }}</Col>
                        <Col span="10" class="has-text-right">
                            {{ $filters.formatThousand(cartStore.totalVariantAmount(cartItem.id, cartVariant.id)) }}
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    </div>

    <Empty
        v-if="!cartStore.hasItems()"
        image-size="80"
        description="Chưa có món nào, vui lòng chọn món!"
    />

    <Sticky :offset-bottom="0" position="bottom">
        <div class="p-2" style="background: var(--van-background);">
            <Button
                :loading="loading"
                loading-type="spinner"
                icon="success"
                type="primary"
                block
                @click="checkout"
            >
                {{ cartStore.hasItems() ? 'Gọi món' : 'Chọn món' }}
            </Button>

            <div class="mt-2">
                <router-link to="/">
                    <Button
                        :loading="loading"
                        loading-type="spinner"
                        icon="arrow-left"
                        type="primary"
                        plain
                        block
                    >
                        Quay lại
                    </Button>
                </router-link>
            </div>
        </div>
    </Sticky>
</template>

<style scoped></style>
