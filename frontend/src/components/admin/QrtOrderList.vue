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
    Row,
    Collapse,
    CollapseItem, showNotify,
} from "vant";

const userApi = new UserApi();
const orderApi = new OrderApi();

// Check user login
userApi.currentUserInfo();

const orders = ref<OrderApiResponse[]>([]);
onMounted(() => {
    refreshOrders();
});

// Dùng để toggle các button phụ của đơn hàng
const activeOrders = ref<number[]>([]);

const orderStore = useOrderStore();
orderStore.connect();


// @todo refactor vue 3 use script setup
// @todo refactor api in service without use repository
// @todo handle list status and payment status
// @todo handle confirm order, complete order, cancel order...

async function refreshOrders() {
    orderApi.list().then((_orders: OrderApiResponse[]) => {
        orders.value = _orders;
    });
}

async function confirmOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderApi.confirm(id);
    if (result.success) {
        showNotify({ type: "success", message: "Đã xác nhận!" });
        await refreshOrders();
        return true;
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
        return false;
    }
}

async function completeOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderApi.complete(id);
    if (result.success) {
        showNotify({ type: "success", message: "Đã hoàn thành!" });
        await refreshOrders();
        return true;
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
        return false;
    }
}

async function cancelOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderApi.cancel(id);
    if (result.success) {
        showNotify({ type: "success", message: "Đã hủy!" });
        await refreshOrders();
        return true;
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
        return false;
    }
}
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
                    <Collapse v-model="activeOrders">
                        <CollapseItem :name="orderIndex">
                            <template #title>
                                <Tag size="large" type="primary" class="mr-2">
                                    {{ order.table.code || "Table" }}
                                </Tag>
                                <b class="is-size-6 mr-1">{{ '#' + (orderIndex + 1) + '. ' }}</b>
                                <b class="is-size-6">{{ order.table.name }}</b>
                            </template>
                            <template #value>
                                <Tag plain size="large" :type="order.tagType" class="mr-2">
                                    {{ order.orderStatusLabel }}
                                </Tag>
                            </template>

                            <div class="p-2">
                                <Row justify="end">
                                    <div>
                                        <Button v-if="order.canComplete && order.isNew" @click="completeOrder(order.id)" type="success" size="small" class="mr-2" icon="success" icon-position="right">
                                            Hoàn thành
                                        </Button>
                                        <Button v-if="order.canCancel" @click="cancelOrder(order.id)" type="danger" size="small" icon="cross" icon-position="right">
                                            Hủy
                                        </Button>
                                    </div>
                                </Row>
                            </div>
                        </CollapseItem>
                    </Collapse>
                    <Cell>
                        <Row justify="space-between">
                            <div>
                                {{ formatDate(order.createdAt) }}
                            </div>
                            <div>
                                <Button v-if="order.isNew" @click="confirmOrder(order.id)" type="primary" size="small" class="mr-2" icon="good-job-o" icon-position="right">
                                    Xác nhận
                                </Button>
                                <Button v-if="order.canComplete && !order.isNew" @click="completeOrder(order.id)" type="success" size="small" class="mr-2" icon="success" icon-position="right">
                                    Hoàn thành
                                </Button>
                            </div>
                        </Row>
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
