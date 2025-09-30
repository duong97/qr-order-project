<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOrderStore } from "@/store/OrderStore";
import { UserApi } from "@/api/admin/UserApi";
import { OrderApi } from "@/api/admin/OrderApi";
import type OrderApiResponse from "@/interface/OrderApiResponse";
import {formatDate, formatCurrency} from "@/utils/format";
import {
    Cell,
    CellGroup,
    Empty,
    Tag,
    Grid,
    GridItem,
    Button,
} from "vant";

const userApi = new UserApi();
const orderApi = new OrderApi();

// Check user login
userApi.currentUserInfo();

const orders = ref<OrderApiResponse[]>([]);
onMounted(() => {
    orderApi.list().then((_orders: OrderApiResponse[]) => {
        orders.value = _orders;
    });
});

const orderStore = useOrderStore();
orderStore.connect();


// @todo refactor vue 3 use script setup
// @todo refactor api in service without use repository
// @todo handle list status and payment status
// @todo handle confirm order, complete order, cancel order...

</script>

<template>
    <div id="order-list" class="p-2">
        <!-- show connecting nếu đang kết nối với socket -->
        <div class="has-text-centered" v-if="!orderStore.connected">
            <span class="tag is-warning">Connecting...</span>
        </div>

        <!-- Title -->
        <h4 class="title has-text-centered">Quản lý order</h4>

        <!-- Empty component -->
        <Empty v-if="!orders.length" description="Chưa có đơn hàng nào" />

        <!-- Show danh sách order -->
        <div v-else>
            <div v-for="(order, orderIndex) in orders" :key="orderIndex" class="mb-5">
                <CellGroup>
                    <Cell>
                        <template #title>
                            <Tag plain size="large" type="primary" class="mr-2">
                                {{ order.table.code || "Table" }}
                            </Tag>
                            <b class="is-size-6">{{ order.table.name }}</b>
                        </template>
                        <template #value>
                            <Button type="primary" size="small" class="mr-2" icon="good-job-o" icon-position="right">Xác nhận</Button>
<!--                            <Button type="success" size="small" class="mr-2" icon="success" icon-position="right">Hoàn thành</Button>-->
<!--                            <Button type="danger" size="small" icon="cross"  icon-position="right">Hủy</Button>-->
                        </template>
                    </Cell>
                    <Cell>
                        {{ formatDate(order.createdAt) }}
                    </Cell>
                    <Cell>
                        <div
                            v-for="(_orderDetail, itemIndex) in order.details || []"
                            :key="itemIndex"
                        >
                            <Grid :column-num="3">
                                <GridItem :text="_orderDetail.product.name" />
                                <GridItem :text="'SL: ' + _orderDetail.qty" />
                                <GridItem :text="formatCurrency(_orderDetail.price)" />
                            </Grid>
                            <p
                                v-for="_productOpt in _orderDetail.productOptions || []"
                                :key="_productOpt.id"
                            >
                                {{ _productOpt.name }}:
                                <span v-for="optItem in _productOpt.items" :key="optItem.id">
                  <span>
                    {{ optItem.name }}
                    <span v-if="optItem.price > 0">
                      (+{{ formatCurrency(optItem.price) }})
                    </span>
                  </span>
                </span>
                            </p>
                        </div>
                    </Cell>
                </CellGroup>
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
