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
    CollapseItem,
    showNotify,
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
// @doing xử lý lưu thêm cột version trong table order, khi confirm / complete.. order thì gắn key là index + version để trigger animation
// tìm hiểu thêm optimic lock

// Load lại list order
async function refreshOrders() {
    orderApi.list().then((_orders: OrderApiResponse[]) => {
        orders.value = _orders;

        // Sau khi load lại thì reset trạng thái các buttons
        collapseAllOrderSubButtons();
    });
}

// Thay thế đơn cũ bằng đơn vừa mới update
function replaceOrders(updatedOrder: OrderApiResponse) {
    const index = orders.value.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
        orders.value[index] = updatedOrder;
    } else {
        orders.value.push(updatedOrder);
    }
}

// đóng hết các collapse order button (các nút hiện thêm ngoài nút thao tác chính)
function collapseAllOrderSubButtons() {
    activeOrders.value = [];
}

// XÁC NHẬN đơn hàng
async function confirmOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderApi.confirm(id);
    if (result) {
        showNotify({ type: "success", message: "Đã xác nhận!" });
        replaceOrders(result as OrderApiResponse);
        return true;
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
        return false;
    }
}

// HOÀN THÀNH đơn hàng
async function completeOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderApi.complete(id);
    if (result) {
        showNotify({ type: "success", message: "Đã hoàn thành!" });

        replaceOrders(result as OrderApiResponse);
        return true;
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
        return false;
    }
}

// HỦY đơn hàng
async function cancelOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderApi.cancel(id);
    if (result) {
        showNotify({ type: "success", message: "Đã hủy!" });
        replaceOrders(result as OrderApiResponse);
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
        <div v-else v-animated-list="'fade'">
            <div v-for="(order, orderIndex) in orders" :key="orderIndex" class="mb-5">
                <CellGroup>
                    <Collapse v-model="activeOrders">
                        <CollapseItem :name="orderIndex">
<!--                            Order title...-->
                            <template #title>
                                <Tag size="large" type="primary" class="mr-2">
                                    {{ order.table.code || "Table" }}
                                </Tag>
                                <b class="is-size-6">{{ order.code }}</b>
                            </template>
                            <template #value>
                                <Tag plain size="large" :type="order.tagType" class="mr-2">
                                    {{ order.orderStatusLabel }}
                                </Tag>
                            </template>

<!--                            Order buttons-->
                            <div class="p-2">
                                <Row justify="end">
                                    <div>
                                        <Button v-if="order.canCancel"
                                                @click="cancelOrder(order.id)"
                                                type="danger"
                                                size="small"
                                                icon="cross"
                                                icon-position="right"
                                                v-confirm="'Xác nhận hoàn thành đơn hàng'"
                                        >
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
                                <Button v-if="order.canComplete && !order.isNew"
                                        @click="completeOrder(order.id)"
                                        type="success"
                                        size="small"
                                        class="mr-2"
                                        icon="success"
                                        icon-position="right"
                                        v-confirm="'Xác nhận hoàn thành đơn hàng'"
                                >
                                    Hoàn thành
                                </Button>
                                <Button v-if="order.isNew"
                                        @click="confirmOrder(order.id)"
                                        type="primary" size="small"
                                        class="mr-2"
                                        icon="good-job-o"
                                        icon-position="right"
                                >
                                    Xác nhận
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
</style>
