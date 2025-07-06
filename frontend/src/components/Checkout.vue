<script lang="ts">
import config from '@/config'
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
import {defineComponent} from 'vue';
import {useCartStore} from "@/store/CartStore";
import CartItem from "@/interface/CartItem";
import Product from "@/interface/Product";
import { useRouter } from 'vue-router';
import {useTableStore} from "@/store/TableStore";

export default defineComponent({
    name: "qrt-checkout",
    components: {
        [NavBar.name]: NavBar,
        [Button.name]: Button,
        [Row.name]: Row,
        [Col.name]: Col,
        [Sticky.name]: Sticky,
        [Divider.name]: Divider,
        [Empty.name]: Empty,
        [Tag.name]: Tag,
        [CellGroup.name]: CellGroup,
        [Field.name]: Field,
    },
    data() {
        return {
            config,
            isShowPopup: false,
            isShowHistory: false,
            cartStore: useCartStore(),
            router: useRouter(),
            tableStore: useTableStore(),
            loading: false,
        }
    },
    computed: {
        cartItems(): CartItem[] {
            return this.cartStore.items || [];
        },
    },
    methods: {
        getItemById(id: number): Product|undefined {
            return this.config.db.products.find(i => i.id === id);
        },
        async checkout() {
            if (!this.tableStore.customerName) {
                await showDialog({
                    message: "Vui lòng nhập họ tên!",
                    confirmButtonText: "OK"
                }).then();
                return;
            }
            if (!this.cartStore.hasItems()) {
                return this.router.push({ path: '/' });
            }
            this.showLoading();
            const isCheckoutSuccess = await this.cartStore.submitOrder(this.tableStore.tableName, this.tableStore.customerName);
            this.hideLoading();
            let message = isCheckoutSuccess ?
                'Đơn hàng của bạn đã được gửi đi, vui lòng đợi xác nhận!' :
                'Có lỗi khi gửi đơn hàng, vui lòng thử lại!'
            showDialog({
                message,
                confirmButtonText: "OK"
            }).then(() => {
                if (isCheckoutSuccess) {
                    return this.router.push({ path: '/' });
                }
            });
        },
        showLoading() {
            this.loading = true;
        },
        hideLoading() {
            this.loading = false;
        }
    }
})
</script>

<template>
    <van-sticky :offset-top="0" position="top">
        <van-nav-bar
            left-text="Back"
            left-arrow
            @click-left="router.push({ path: '/' })"
            :left-disabled="loading"
        >
            <template #title>
                Checkout bàn <van-tag size="large" plain type="warning">{{ tableStore.tableName }}</van-tag>
            </template>
        </van-nav-bar>
    </van-sticky>
    <div class="content">
        <van-cell-group inset class="mt-2">
            <van-field v-model="tableStore.customerName"
                       label="Họ tên"
                       :error-message="tableStore.customerName ? '' : 'Vui lòng nhập họ tên'"
                       placeholder="Khách" />
        </van-cell-group>

        <div v-for="cartItem in cartItems" :key="cartItem.id">
            <div v-for="cartVariant in cartItem.variants" :key="cartVariant.id">
                <div class="box m-3">
                    <div>
                        <span class="title is-5"> {{ getItemById(cartItem.id)?.name }} </span>
                        <div v-for="cartItemOption in cartVariant.itemOptions" :key="cartItemOption.id">
                            <div class="is-size-7">
                                <p>
                                    <b>{{ cartItemOption.name }}: </b> {{ cartItemOption.items.map(i => i.name).join(', ') }}
                                </p>
                            </div>
                        </div>
                        <p v-if="cartVariant.note"><b>Ghi chú: </b> {{ cartVariant.note }}</p>
                    </div>

                    <van-divider />

                    <van-row justify="space-around" class="has-text-weight-bold">
                        <van-col span="10" class="has-text-left">
                            SL: {{ cartVariant.qty }}
                        </van-col>
                        <van-col span="10" class="has-text-right">
                            {{ $filters.formatThousand(cartStore.totalVariantAmount(cartItem.id, cartVariant.id)) }}
                        </van-col>
                    </van-row>
                </div>
            </div>
        </div>
    </div>

    <van-empty
        v-if="!cartStore.hasItems()"
        image-size="80"
        description="Chưa có món nào, vui lòng chọn món!"
    />

    <van-sticky :offset-bottom="0" position="bottom">
        <div class="p-2" style="background: var(--van-background);">
            <van-button
                :loading="loading"
                loading-type="spinner"
                icon="success"
                type="primary"
                block
                @click="checkout">
                {{ cartStore.hasItems() ? "Gọi món" : "Chọn món" }}
            </van-button>

            <div class="mt-2">
                <router-link :to="{ path: '/' }">
                    <van-button :loading="loading" loading-type="spinner" icon="arrow-left" type="primary" plain block>
                        Quay lại
                    </van-button>
                </router-link>
            </div>
        </div>
    </van-sticky>
</template>

<style scoped>
</style>