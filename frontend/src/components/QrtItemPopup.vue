<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { uuid } from 'vue-uuid';
import config from '@/config';
import Qty from '@/components/Qty.vue';
import {
    Popup,
    Cell,
    Card,
    NavBar,
    Checkbox,
    CheckboxGroup,
    CellGroup,
    Radio,
    RadioGroup,
    SubmitBar,
} from 'vant';
import type Product from '@/interface/Product';
import type ProductOption from '@/interface/ProductOption';
import type CartItem from '@/interface/CartItem';

interface Props {
    item: Product;
    viewOnly?: boolean;
    isShow: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:isShow', 'onSubmitItem']);

const show = ref(props.isShow);
const qty = ref(0);
const note = ref('');
const isShowHistory = ref(false);
const itemOptions = ref<ProductOption[]>([]);
const cart = ref<CartItem>({} as CartItem);

const cacheKeyQty = `qty_${props.item.id}`;
const cacheKeyNote = `note_${props.item.id}`;

// Watchers
watch(
    () => props.item,
    (newVal) => {
        if (props.viewOnly && newVal?.order) {
            qty.value = +newVal.order.qty;
        }
    },
    { immediate: true }
);

watch(
    () => props.isShow,
    (val) => (show.value = val)
);

// Computed total
const totalAmount = computed(() => {
    let total = props.item.price * qty.value;

    total += itemOptions.value.reduce(
        (sum, o) =>
            o.items.reduce(
                (sum2, o2) =>
                    (Array.isArray(o.selected)
                        ? o.selected.includes(o2.id || 0)
                        : o.selected === o2.id)
                        ? o2.price
                        : 0 + sum2,
                0
            ) + sum,
        0
    );

    return total / 10;
});

function reloadOptions() {
    itemOptions.value = config.db.options
        .filter((o: any) => props.item.options?.includes(o.id || 0))
        .map((i: any) => {
            const defaultItem = i.items.find((o: any) => o.default);
            i.selected = defaultItem
                ? i.multiple
                    ? [defaultItem.id]
                    : defaultItem.id
                : i.multiple
                    ? []
                    : null;
            return i;
        });
}

function onSubmit() {
    show.value = false;
    const cloneOptions = JSON.parse(JSON.stringify(itemOptions.value)) as ProductOption[];

    cart.value = {
        id: props.item.id,
        variants: [
            {
                id: uuid.v4(),
                qty: qty.value,
                note: note.value,
                price: props.item.price,
                itemOptions: cloneOptions
                    .filter((i) => (Array.isArray(i.selected) ? i.selected.length : i.selected))
                    .map((o) => {
                        o.items = o.items.filter((i: any) =>
                            Array.isArray(o.selected)
                                ? o.selected.includes(i.id || 0)
                                : o.selected === i.id
                        );
                        return { ...o };
                    }),
            },
        ],
    };

    emit('onSubmitItem', cart.value);
    resetOption();
}

function resetOption() {
    qty.value = 1;
    reloadOptions();
}

// Mounted
reloadOptions();
qty.value = +(localStorage.getItem(cacheKeyQty) || 1);
note.value = localStorage.getItem(cacheKeyNote) || '';
</script>

<template>
    <Popup
        v-model:show="show"
        round
        closeable
        position="bottom"
        :style="{ padding: '12px 10px 75px 10px', height: '85vh' }"
    >
        <NavBar title="Chọn topping" />
        <Card
            :price="$filters.formatThousand(item.price)"
            :title="item.name"
            :desc="item.description"
            currency="₫"
            :thumb="item.thumbnail"
        />

        <div class="buttons has-addons mb-2 mt-2 is-justify-content-end">
            <Qty v-model="qty" />
        </div>

        <div class="scroll-div">
            <div v-for="option in itemOptions" :key="option.id">
                <h2>{{ option.name }}</h2>

                <CheckboxGroup v-model="option.selected" v-if="option.multiple">
                    <CellGroup inset>
                        <Cell v-for="optionItem in option.items" :key="optionItem.id">
                            <span class="topping-price">+{{ optionItem.price }}</span>
                            <Checkbox
                                :name="optionItem.id"
                                shape="square"
                                label-position="left"
                                class="is-justify-content-space-between"
                            >
                                {{ optionItem.name }}
                            </Checkbox>
                        </Cell>
                    </CellGroup>
                </CheckboxGroup>

                <RadioGroup v-model="option.selected" v-else>
                    <CellGroup inset>
                        <Cell v-for="optionItem in option.items" :key="optionItem.id">
                            <span class="topping-price">+{{ optionItem.price }}</span>
                            <Radio
                                label-position="left"
                                class="is-justify-content-space-between"
                                :name="optionItem.id"
                            >
                                {{ optionItem.name }}
                            </Radio>
                        </Cell>
                    </CellGroup>
                </RadioGroup>
            </div>

            <h6>Ghi chú</h6>
            <textarea
                v-model="note"
                class="textarea is-small animate__animated animate__faster"
                placeholder="Add note to your order..."
                rows="4"
            />
        </div>

        <SubmitBar
            :decimal-length="config.decimalLength"
            :currency="config.currency"
            label="Total"
            :price="totalAmount"
            button-text="OK"
            @submit="onSubmit"
            style="margin-bottom: 12px;"
            :disabled="qty === 0"
        />
    </Popup>
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
