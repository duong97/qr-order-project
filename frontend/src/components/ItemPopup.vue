<script lang="ts">
import config from '@/config'
import Qty from "@/components/Qty.vue";
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
} from 'vant';
import {ref, defineComponent} from 'vue';
import type { PropType } from 'vue'
import { uuid } from 'vue-uuid';
import ProductOption from '@/interface/ProductOption';
import Product from "@/interface/Product";
import CartItem from "@/interface/CartItem";

export default defineComponent({
    name: "qrt-item-popup",
    components: {
        Qty,
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
    },
    // emits: ["onChangeItemQty"],
    props: {
        item: {type: Object as PropType<Product>, required: true},
        viewOnly: Boolean,
        isShow: Boolean,
    },
    emits: ['update:isShow', 'onSubmitItem'],
    watch: {
        item: function(newVal) {
            if (this.viewOnly) {
                this.qty = +newVal.order.qty;
            }
        },
        isShow: function(newVal) {
            this.show = newVal;
        },
    },
    computed: {
        totalAmount(): number {
            let totalAmount = this.item.price * this.qty + this.itemOptions.reduce(
                (sum, o) => o.items.reduce(
                    (sum2, o2) => ((Array.isArray(o.selected) ? o.selected.includes(o2.id || 0) : o.selected === o2.id) ? o2.price : 0) + sum2,
                    0
                ) + sum, 0);
            totalAmount /= 10;
            return totalAmount;
        }
    },
    data() {
        return {
            qty: 0,
            cacheKeyQty: 'qty_' + this.item.id,
            cacheKeyNote: 'note_' + this.item.id,
            note: '' as string,
            config,
            isShowHistory: false,
            itemOptions: [] as ProductOption[],
            cart: {} as CartItem,
        }
    },
    setup() {
        const show = ref(false);

        return {
            show
        };
    },
    mounted() {
        this.show = this.isShow;
        this.qty = +(localStorage.getItem(this.cacheKeyQty) || 1);
        this.note = localStorage.getItem(this.cacheKeyNote) || '';
        if (this.viewOnly) {
            // this.qty = +(this.item?.order?.qty || 0);
            // this.note = this.item?.order?.note || '';
        } else {
            // this.onChangeItemQty(true);
        }

        this.reloadOptions();
    },
    methods: {
        toggleHistory() {
            this.isShowHistory = !this.isShowHistory;
        },
        reloadOptions() {
            // @todo load options from db
            this.itemOptions = config.db.options
                .filter(o => this.item.options?.includes(o.id || 0))
                .map(i => {
                    let defaultItem = i.items.find(o => o.default);
                    if (defaultItem) {
                        i.selected = i.multiple ? [defaultItem.id] : defaultItem.id;
                    } else {
                        i.selected = i.multiple ? [] : null;
                    }
                    return i;
                })
            ;
        },
        onSubmit() {
            this.show = false;
            let cloneItemOptions = JSON.parse(JSON.stringify(this.itemOptions)) as ProductOption[];
            this.cart = {
                id: this.item.id,
                variants: [
                    {
                        itemOptions: cloneItemOptions
                            .filter(i => Array.isArray(i.selected) ? i.selected.length : i.selected) // Filter not selected item
                            .map(o => {
                                o.items = o.items.filter(i => Array.isArray(o.selected) ? o.selected.includes(i.id || 0) : o.selected === i.id); // Filter not selected option
                                return {...o}; // Clone object
                            }),
                        id: uuid.v4(),
                        qty: this.qty,
                        note: this.note,
                        price: this.item.price,
                    }
                ],
            };
            this.$emit('onSubmitItem', this.cart);

            this.resetOption();
        },
        resetOption() {
            this.qty = 1;
            this.reloadOptions();
        }
    }
})
</script>

<template>
    <van-popup
        v-model:show="show"
        round
        closeable
        position="bottom"
        :style="{ padding: '12px 10px 75px 10px', 'height': '85vh' }"
    >
        <van-nav-bar title="Chọn topping" />
        <van-card
            :price="$filters.formatThousand(item.price)"
            :title="item.name"
            :desc="item.description"
            currency="₫"
            :thumb="item.thumbnail"
        />

        <div class="buttons has-addons mb-2 mt-2 is-justify-content-end">
            <Qty v-model="qty"></Qty>
        </div>

        <div class="scroll-div">
            <div>
                <div v-for="option in itemOptions" :key="option.id">
                    <h2>{{ option.name }}</h2>

                    <van-checkbox-group v-model="option.selected" v-if="option.multiple">
                        <van-cell-group inset>
                            <van-cell v-for="optionItem in option.items" :key="optionItem.id">
                                <span class="topping-price">+{{ optionItem.price }}</span>
                                <van-checkbox
                                    :name="optionItem.id"
                                    shape="square"
                                    label-position="left"
                                    class="is-justify-content-space-between"
                                >
                                    {{ optionItem.name }}
                                </van-checkbox>
                            </van-cell>
                        </van-cell-group>
                    </van-checkbox-group>

                    <van-radio-group v-model="option.selected" v-if="!option.multiple">
                        <van-cell-group inset>
                            <van-cell v-for="optionItem in option.items" :key="optionItem.id">
                                <span class="topping-price">+{{ optionItem.price }}</span>
                                <van-radio
                                    label-position="left"
                                    class="is-justify-content-space-between"
                                    :name="optionItem.id" >
                                    {{ optionItem.name }}
                                </van-radio>
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                </div>
            </div>

            <h6>Ghi chú</h6>
            <textarea
                v-model="note"
                class="textarea is-small animate__animated animate__faster"
                placeholder="Add note to your order..."
                rows="4" />
        </div>

        <van-submit-bar
            :decimal-length="config.decimalLength"
            :currency="config.currency"
            label="Total"
            :price="totalAmount"
            button-text="OK"
            @submit="onSubmit"
            style="margin-bottom: 12px;"
            :disabled="qty === 0"
        />
    </van-popup>
</template>

<style scoped>
.topping-price {
    position: absolute;
    right: calc(var(--van-checkbox-size) + 10px);
    top: -3px;
}
.scroll-div {
    height: 36vh;
    overflow-y: scroll;
}
</style>