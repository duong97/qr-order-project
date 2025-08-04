<script lang="ts">
import config from '@/config'
import {Tab, Tabs, Button, SubmitBar, Tag} from "vant";
import {ref, defineComponent} from "vue";
import QrtItem from "@/components/Item.vue";
import {useCartStore} from "@/store/CartStore";
import {useTableStore} from "@/store/TableStore";
import {useProductStore} from "@/store/ProductStore";
import {useCategoryStore} from "@/store/CategoryStore";

export default defineComponent({
    name: 'qrt-home',
    components: {
        QrtItem,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Button.name]: Button,
        [SubmitBar.name]: SubmitBar,
        [Tag.name]: Tag,
    },
    data() {
        return {
            config,
            isShowBannerWelcome: true,
            qtyAnimation: false,
            tableStore: useTableStore(),
        }
    },
    setup() {
        const active = ref(1);
        const cartStore = useCartStore();
        const productStore = useProductStore();
        const categoryStore = useCategoryStore();

        return {
            active,
            productStore,
            categoryStore,
            cartStore
        };
    },
    mounted() {
        this.loadProductList();
        this.loadCategoryList();
    },
    methods: {
        async loadProductList() {
            await this.productStore.fetch();
        },
        async loadCategoryList() {
            if (this.categoryStore.items.length === 0) {
                await this.categoryStore.fetch();
            }
        },
    },
});


</script>

<template>
    <!-- BEGIN category tabs -->
    <van-tabs v-model:active="active" scrollspy sticky>
        <van-tab v-for="category in categoryStore.items" :title="category.name" :name="category.id" :key="category.id">
            <!-- BEGIN list items group by category -->
            <div class="box">
                <p class="title is-4">{{ category.name }}</p>
                <div v-for="item in productStore.items" :key="item.id">
                    <qrt-item :item="item" v-if="item.categories?.includes(category.id)"></qrt-item>
                </div>
            </div>
            <!-- END list items group by category -->
        </van-tab>
    </van-tabs>
    <!-- END category tabs -->

    <router-link :to="{ path: '/checkout' }">
        <van-submit-bar
            :disabled="!cartStore.hasItems()"
            :price="cartStore.totalAmount() / 10"
            :decimal-length="config.decimalLength"
            :currency="config.currency"
            button-text="Checkout"
            button-type="success"
            label="Tổng tiền"
        >
            <van-tag size="large" plain type="warning">{{ tableStore.tableName }}</van-tag>
        </van-submit-bar>
    </router-link>
    <!-- END button checkout -->
</template>

<style scoped>
</style>
