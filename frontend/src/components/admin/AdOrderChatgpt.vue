<script lang="ts">
import {defineComponent} from "vue";
import {
    Button,
    Tabs,
    Tab,
    Card,
    Cell,
    CellGroup,
    Divider,
    Empty,
} from "vant";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/AuthStore";
import {useOrderStore} from "@/store/OrderStore";
import {UserApi} from "@/api/admin/UserApi";

const userApi = new UserApi();

export default defineComponent({
    name: "qrt-admin-order",
    components: {
        [Button.name]: Button,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        [Card.name]: Card,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Divider.name]: Divider,
        [Empty.name]: Empty,
    },
    setup() {
        // Check user login
        userApi.currentUserInfo();

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
            formatCurrency,
        };
    },
});
</script>

<template>
    <div id="order-list" class="p-2">
        <div class="mb-2">
            Connection status:
            <b>{{ orderStore.connected ? "Connected" : "Connecting..." }}</b>
        </div>

        <!-- Nếu chưa có order -->
        <van-empty
            v-if="!orderStore.orders.length"
            description="Chưa có đơn hàng nào"
        />

        <!-- Danh sách order -->
        <div v-else>
            <div
                v-for="(order, orderIndex) in orderStore.orders"
                :key="orderIndex"
                class="mb-4"
            >
                <van-card
                    :title="`Bàn: ${order.tableName}`"
                    :desc="`Khách: ${order.customerName}`"
                    thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
                />

                <van-cell-group inset>
                    <van-cell
                        v-for="(item, itemIndex) in order.items"
                        :key="itemIndex"
                        :title="`Món #${item.id}`"
                    >
                        <template #label>
                            <div
                                v-for="variant in item.variants"
                                :key="variant.id"
                                class="mb-1"
                            >
                                <div class="flex justify-between">
                  <span>
                    SL: {{ variant.qty }} • Giá:
                    {{ formatCurrency(variant.price) }}
                  </span>
                                    <span v-if="variant.note">📝 {{ variant.note }}</span>
                                </div>

                                <!-- Hiển thị options -->
                                <div
                                    v-if="variant.itemOptions.length"
                                    class="text-xs text-gray-500 ml-2"
                                >
                                    <div v-for="opt in variant.itemOptions" :key="opt.id">
                                        {{ opt.name }}:
                                        <span
                                            v-for="optItem in opt.items"
                                            :key="optItem.id"
                                        >
                      <span v-if="optItem.id === opt.selected">
                        {{ optItem.name }}
                        <span v-if="optItem.price > 0">
                          (+{{ formatCurrency(optItem.price) }})
                        </span>
                      </span>
                    </span>
                                    </div>
                                </div>

                                <van-divider dashed/>
                            </div>
                        </template>
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
</style>
