<script setup lang="ts">
import Qty from "@/components/Qty.vue";
import ItemPopup from "@/components/ItemPopup.vue";
import {
    TextEllipsis,
    ActionSheet,
    Button,
    showNotify,
} from 'vant';
import { ref, computed, onBeforeUpdate } from 'vue';
import CartItem from "@/interface/CartItem";
import CartItemVariant from "@/interface/CartItemVariant";
import { useCartStore } from "@/store/CartStore";
import { StringHelper } from "@/helpers/StringHelper";

const props = defineProps<{
    item: any;
    isManager?: boolean;
    table?: any;
    viewOnly?: boolean;
    isBlockFunction?: boolean;
}>();

const cartStore = useCartStore();

const isShowPopup = ref(false);
const isShowHistory = ref(false);
const checkboxRefs = ref<any[]>([]);

onBeforeUpdate(() => {
    checkboxRefs.value = [];
});

// ✅ Computed
const cartVariants = computed<CartItemVariant[]>(() => {
    const variants = cartStore.items.find(i => i.id === props.item.id)?.variants || [];
    return variants.filter(v => v.qty > 0);
});

const qty = computed<number>(() => {
    return +(cartStore.totalVariants(props.item.id) || 0);
});

// ✅ Methods
function showPopup() {
    isShowPopup.value = true;
}

function hidePopup() {
    isShowPopup.value = false;
}

function addItemToCart(cartItem: CartItem) {
    cartStore.addItem(cartItem);
}

function toggleHistory() {
    isShowHistory.value = !isShowHistory.value;
}

function onCartVariantQtyDecrease(cartVariant: CartItemVariant) {
    if (cartVariant.qty > 0) return;
    cartStore.removeItemVariant(props.item.id, cartVariant.id);
    showNotify({ type: 'warning', message: 'Đã xóa tùy chọn' });
}
</script>

<template>
    <ItemPopup
        :item="props.item"
        :isShow="isShowPopup"
        @close="hidePopup"
        @onSubmitItem="addItemToCart"
        :key="props.item.id"
    />

    <div class="columns is-mobile mb-0">
        <div class="column is-one-third">
            <figure class="image is-square">
                <img
                    :src="StringHelper.convertDriveLinkToDirectImageUrl(props.item.thumbnail)"
                    :alt="props.item.name"
                />
            </figure>
        </div>

        <div class="column is-two-thirds">
            <span class="title is-6">{{ props.item.name }}</span>
            <p class="is-size-7 mb-1">
                <TextEllipsis
                    rows="1"
                    :content="props.item.description"
                    expand-text="Xem thêm"
                    collapse-text="Thu gọn"
                />
            </p>
            <b class="has-text-danger">{{ $filters.formatThousand(props.item.price) }}</b>

            <Qty
                v-model="qty"
                class="buttons has-addons are-small mb-2 is-pulled-right"
                :preventQtyChange="true"
                @onQtyIncrease="showPopup"
                @onQtyDecrease="toggleHistory"
            />

            <div v-if="cartVariants.length > 0">
                <Button
                    type="default"
                    size="mini"
                    block
                    icon-position="right"
                    icon="arrow"
                    @click="toggleHistory"
                >
                    Món đã đặt
                </Button>
            </div>
        </div>
    </div>

    <ActionSheet
        cancel-text="OK"
        close-on-click-action
        v-model:show="isShowHistory"
        title="Danh sách tùy chọn món"
    >
        <template #cancel>
            <Button type="primary" block>Đóng</Button>
        </template>

        <div class="content">
            <Transition enter-active-class="animate__fadeInDown" leave-active-class="animate__fadeOutDown">
                <div class="animate__animated animate__faster">
                    <div v-for="cartVariant in cartVariants" :key="cartVariant.id">
                        <div style="padding: 5px 10px;">
                            <div class="box">
                                <div style="float: left;">
                                    <span class="title is-6">{{ props.item.name }}</span>

                                    <div v-for="cartItemOption in cartVariant.itemOptions" :key="cartItemOption.id">
                                        <div class="is-size-7">
                                            <p><b>{{ cartItemOption.name }}: </b></p>
                                            {{ cartItemOption.items.map(i => i.name).join(', ') }}
                                        </div>
                                    </div>

                                    <p v-if="cartVariant.note"><b>Ghi chú: </b> {{ cartVariant.note }}</p>
                                </div>

                                <div style="float: right;">
                                    <h6 class="has-text-centered mb-1">
                                        {{ $filters.formatThousand(cartStore.totalVariantAmount(props.item.id, cartVariant.id)) }}
                                    </h6>

                                    <Qty
                                        v-model="cartVariant.qty"
                                        @onQtyDecrease="onCartVariantQtyDecrease(cartVariant)"
                                        class="buttons has-addons mb-2 is-pulled-right"
                                    />
                                </div>

                                <div style="clear: both;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </ActionSheet>
</template>

<style scoped>
</style>