<script lang="ts">
import config from '@/config'
import Qty from "@/components/Qty.vue";
import ItemPopup from "@/components/ItemPopup.vue";
import {
    SubmitBar,
    Divider,
    Popup,
    Cell,
    Card,
    NavBar,
    Field,
    Checkbox,
    CheckboxGroup,
    CellGroup,
    Radio,
    RadioGroup,
    TextEllipsis,
    ActionSheet,
    Button,
    showNotify
} from 'vant';
import {onBeforeUpdate, ref, defineComponent} from 'vue';
import CartItem from "@/interface/CartItem";
import {useCartStore} from "@/store/CartStore";
import CartItemVariant from "@/interface/CartItemVariant";
import {StringHelper} from "@/helpers/StringHelper";

export default defineComponent({
    name: "qrt-item",
    components: {
        Qty,
        ItemPopup,
        [Popup.name]: Popup,
        [Cell.name]: Cell,
        [Card.name]: Card,
        [NavBar.name]: NavBar,
        [Field.name]: Field,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        [CellGroup.name]: CellGroup,
        [Radio.name]: Radio,
        [RadioGroup.name]: RadioGroup,
        [Divider.name]: Divider,
        [SubmitBar.name]: SubmitBar,
        [TextEllipsis.name]: TextEllipsis,
        [ActionSheet.name]: ActionSheet,
        [Button.name]: Button,
    },
    props: [
        'item',
        'isManager',
        'table',
        'viewOnly',
        'isBlockFunction',
    ],
    data() {
        return {
            config,
            isShowPopup: false,
            isShowHistory: false,
        }
    },
    computed: {
        StringHelper() {
            return StringHelper
        },
        cartVariants(): CartItemVariant[] {
            const variants = this.cartStore.items.find(i => i.id === this.item.id)?.variants || [];
            return variants.filter(v => v.qty > 0);
        },
        qty(): number {
            return +(this.cartStore.totalVariants(this.item.id) || 0);
        }
    },
    setup() {
        const checked = ref([]);
        const checkedRadio = ref('1');
        const checkboxRefs = ref([]);
        const cartStore = useCartStore();

        onBeforeUpdate(() => {
            checkboxRefs.value = [];
        });

        return {
            checked,
            checkedRadio,
            checkboxRefs,
            cartStore,
        };
    },
    methods: {
        showPopup() {
            this.isShowPopup = true;
        },
        hidePopup() {
            this.isShowPopup = false;
        },
        addItemToCart(cartItem: CartItem) {
            this.cartStore.addItem(cartItem);
        },
        toggleHistory() {
            this.isShowHistory = !this.isShowHistory;
        },
        onCartVariantQtyDecrease(cartVariant: CartItemVariant) {
            if (cartVariant.qty > 0) {
                return;
            }

            this.cartStore.removeItemVariant(this.item.id, cartVariant.id);
            showNotify({ type: 'warning', message: 'Đã xóa tùy chọn' });
        }
    }
})
</script>

<template>
    <ItemPopup
        :item="item"
        :isShow="isShowPopup"
        @close="hidePopup"
        @onSubmitItem="addItemToCart"
        :key="item.id"
    />

    <div class="columns is-mobile mb-0">
        <div class="column is-one-third">
            <figure class="image is-square">
                <img :src="StringHelper.convertDriveLinkToDirectImageUrl(item.thumbnail)" :alt="item.name"/>
            </figure>
        </div>
        <div class="column is-two-thirds">
            <span class="title is-6">{{ item.name }}</span>
            <p class="is-size-7 mb-1">
                <van-text-ellipsis
                    rows="1"
                    :content="item.description"
                    expand-text="Xem thêm"
                    collapse-text="Thu gọn"
                />
            </p>
            <b class="has-text-danger">{{ $filters.formatThousand(item.price) }}</b>
            <Qty
                v-model="qty"
                class="buttons has-addons are-small mb-2 is-pulled-right"
                :preventQtyChange="true"
                @onQtyIncrease="showPopup"
                @onQtyDecrease="toggleHistory"
            />
            <div v-if="cartVariants.length > 0">
                <van-button
                    type="default"
                    size="mini"
                    block
                    icon-position="right"
                    icon="arrow"
                    @click="toggleHistory"
                >
                    Món đã đặt
                </van-button>
            </div>
        </div>
    </div>

    <van-action-sheet
        cancel-text="OK"
        close-on-click-action
        v-model:show="isShowHistory"
        title="Danh sách tùy chọn món">
        <template #cancel>
            <van-button type="primary" block>Đóng</van-button>
        </template>
        <div class="content">
            <Transition enter-active-class="animate__fadeInDown" leave-active-class="animate__fadeOutDown">
                <div class="animate__animated animate__faster">
                    <div v-for="cartVariant in cartVariants" :key="cartVariant.id">
                        <div style="padding: 5px 10px;">
                            <div class="box">
                                <div style="float: left;">
                                    <span class="title is-6"> {{ item.name }} </span>
                                    <div v-for="cartItemOption in cartVariant.itemOptions" :key="cartItemOption.id">
                                        <div class="is-size-7">
                                            <p>
                                                <b>{{ cartItemOption.name }}: </b>
                                            </p>
                                            {{ cartItemOption.items.map(i => i.name).join(', ') }}
                                        </div>
                                    </div>
                                    <p v-if="cartVariant.note"><b>Ghi chú: </b> {{ cartVariant.note }}</p>
                                </div>

                                <div style="float: right;">
                                    <h6 class="has-text-centered mb-1">{{ $filters.formatThousand(cartStore.totalVariantAmount(item.id, cartVariant.id)) }}</h6>
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
    </van-action-sheet>
</template>

<style scoped>
</style>