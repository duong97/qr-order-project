<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {
    Button,
    Tabs,
    Tab,
    Cell,
    CellGroup,
    Divider,
    Empty,
    Tag,
    NavBar,
    Grid,
    GridItem,
} from "vant";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/AuthStore";
import {useOrderStore} from "@/store/OrderStore";
import {UserApi} from "@/api/admin/UserApi";
import {OrderApi} from "@/api/admin/OrderApi";
import OrderApiResponse from "@/interface/OrderApiResponse";

const userApi = new UserApi();
const orderApi = new OrderApi()

export default defineComponent({
    name: "qrt-admin-order",
    components: {
        [Button.name]: Button,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Divider.name]: Divider,
        [Empty.name]: Empty,
        [Tag.name]: Tag,
        [NavBar.name]: NavBar,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
    },
    setup() {
        // Check user login
        userApi.currentUserInfo();

        const orders = ref<OrderApiResponse[]>([]);
        onMounted(() => {
            // fetch API ở đây
            orderApi.list().then((_orders: OrderApiResponse[]) => {
                orders.value = _orders;
            });
        });

        const authStore = useAuthStore();
        const router = useRouter();
        const orderStore = useOrderStore();
        orderStore.connect();

        const formatCurrency = (value: number) =>
            new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(value);

        return {
            authStore,
            orderStore,
            router,
            orders,
            formatCurrency,
        };
    },
});
</script>

<template>
    <div id="order-list" class="p-2">
<!--        show connecting nếu đang kết nối với socket-->
        <div class="has-text-centered" v-if="!orderStore.connected">
            <span class="tag is-warning">Connecting...</span>
        </div>

<!--        Title-->
        <h4 class="title has-text-centered">Quản lý order</h4>

<!--        Empty component-->
        <van-empty v-if="!orders.length" description="Chưa có đơn hàng nào"/>

<!--        Show danh sách order-->
        <div v-else>
<!--            @todo Show list item order-->
            <div v-for="(order, orderIndex) in orders" :key="orderIndex" class="mb-5">
                <van-cell-group>
                    <van-cell>
                        <template #title>
                            <van-tag plain size="large" type="primary" class="mr-2">{{ order.table.code || 'Table' }}</van-tag>
                            <b class="is-size-6">{{ order.table.name }}</b>
                        </template>
                    </van-cell>
                    <van-cell>
                        {{ (order.createdAt) }}
                    </van-cell>
                    <van-cell>
                        <div v-for="(_orderDetail, itemIndex) in (order.details || [])" :key="itemIndex">
                            <van-grid :column-num="3">
                                <van-grid-item :text="_orderDetail.product.name" />
                                <van-grid-item :text="'SL: ' + _orderDetail.qty" />
                                <van-grid-item :text="formatCurrency(_orderDetail.price)" />
                            </van-grid>
                            <p v-for="_productOpt in (_orderDetail.productOptions || [])" :key="_productOpt.id">
                                {{ _productOpt.name }}:
                                <span v-for="optItem in _productOpt.items" :key="optItem.id">
                                    <span>
                                        {{ optItem.name }}
                                        <span v-if="optItem.price > 0"> (+{{ formatCurrency(optItem.price) }}) </span>
                                    </span>
                                </span>
                            </p>
                        </div>
                    </van-cell>
                </van-cell-group>
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    justify-content: space-between;
}

.mb-1 {
    margin-bottom: 4px;
}

.mb-2 {
    margin-bottom: 8px;
}

.mb-4 {
    margin-bottom: 16px;
}

.ml-2 {
    margin-left: 8px;
}

.text-xs {
    font-size: 12px;
}

.text-gray-500 {
    color: #999;
}

.table-title {
    padding: 4px 8px;
    background: #f7f8fa;
    border-radius: 6px;
    margin-bottom: 4px;
}
</style>