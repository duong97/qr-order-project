<script setup lang="ts">
import {ref, onMounted} from "vue";
import { useOrderStore } from "@/store/OrderStore";
import { UserApi } from "@/api/admin/UserApi";
import {formatTime, formatCurrency} from "@/utils/format";
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
interface Props {
    status: number
}

const props = defineProps<Props>()
const userApi = new UserApi();
const orderStore = useOrderStore();

// Check user login
userApi.currentUserInfo();

onMounted(() => {
    orderStore.fetchOrders(props.status);
    collapseAllOrderSubButtons();
});

// Dùng để toggle các button phụ của đơn hàng
const activeOrders = ref<number[]>([]);

// đóng hết các collapse order button (các nút hiện thêm ngoài nút thao tác chính)
function collapseAllOrderSubButtons() {
    activeOrders.value = [];
}

// XÁC NHẬN đơn hàng
async function confirmOrder(id?: number|null): Promise<boolean> {
    if (!id) {
        return false;
    }
    const result = await orderStore.confirmOrder(id);
    if (result) {
        showNotify({ type: "success", message: "Đã xác nhận!" });
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
    const result = await orderStore.completeOrder(id);
    if (result) {
        showNotify({ type: "success", message: "Đã hoàn thành!" });
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
    const result = await orderStore.cancelOrder(id);
    if (result) {
        showNotify({ type: "success", message: "Đã hủy!" });
        return true;
    } else {
        showNotify({ type: "danger", message: "Có lỗi xảy ra!" });
        return false;
    }
}
// @todo update UI order list with design in https://app.uizard.io/prototypes/8XqOxnJ0Obund9Q1VQ1l
</script>

<template>
    <!-- Empty component -->
    <Empty v-if="!orderStore.ordersByStatus.find((o: any) => o.statusId === props.status)?.orders?.length" description="Chưa có đơn hàng nào" />

    <!-- Show danh sách order -->
    <div v-else>
        <TransitionGroup name="list" tag="div">
            <div v-for="(order) in orderStore.ordersByStatus.find((o: any) => o.statusId === props.status)?.orders || []" :key="order.id + '_' + order.version" class="mt-3">
                <CellGroup>
                    <Cell>
                        <template #title>
                            <Tag size="large" type="primary" class="mr-2">
                                {{ order.table.code || "Table" }}
                            </Tag>
                            <b class="is-size-6">{{ order.code }}</b>
                        </template>
                        <template #value>
                            {{ 'Lúc ' + formatTime(order.createdAt) }}
                        </template>
                    </Cell>
                    <Cell>
                        <div
                            v-for="(_orderDetail, itemIndex) in order.details || []"
                            :key="itemIndex"
                        >
                            <Cell
                                :title="_orderDetail.qty + ' x ' + _orderDetail.product.name"
                                :value="formatCurrency(_orderDetail.price)"
                            >
                                <template #label>
                                    <p
                                        v-for="_productOpt in _orderDetail.productOptions || []"
                                        :key="_productOpt.id"
                                    >
                                        {{ _productOpt.name }}:
                                        <span v-for="optItem in _productOpt.items" :key="optItem.id">
                                            {{ optItem.name }}
                                            <span v-if="optItem.price > 0">
                                              (+{{ formatCurrency(optItem.price) }})
                                            </span>
                                        </span>
                                    </p>
                                </template>
                            </Cell>
                        </div>
                    </Cell>
                    <Cell>
                        <Row justify="end">
                            <div>
                                <Button v-if="order.canCancel"
                                        @click="cancelOrder(order.id)"
                                        type="danger"
                                        size="small"
                                        icon="cross"
                                        plain
                                        icon-position="right"
                                        v-confirm="'HỦY đơn hàng này?'"
                                        class="mr-2"
                                >
                                    Hủy
                                </Button>
                                <Button v-if="order.canComplete && !order.isNew"
                                        @click="completeOrder(order.id)"
                                        type="success"
                                        size="small"
                                        class="mr-2"
                                        icon="success"
                                        icon-position="right"
                                        v-confirm="'HOÀN THÀNH đơn hàng này?'"
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
                </CellGroup>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
</style>
