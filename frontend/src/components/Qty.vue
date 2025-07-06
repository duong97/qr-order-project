<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "qrt-qty",
    data() {
        return {}
    },
    props: {
        value: {type: Number, default: 0},
        modelValue: {type: Number, default: 0},
        preventQtyChange: {type: Boolean, default: false},
        buttonClass: {type: String, default: 'is-small'}, // possible values: is-tiny, is-small, is-normal, is-medium, is-large
    },
    emits: ['update:modelValue', 'onQtyIncrease', 'onQtyDecrease'],
    methods: {
        increaseQty() {
            let qty = this.modelValue;
            if (qty < 1000) {
                if (!this.preventQtyChange) {
                    qty += 1;
                }
                this.$emit('update:modelValue', qty);
                this.$emit('onQtyIncrease', qty);
            }
        },
        decreaseQty() {
            let qty = this.modelValue;
            if (qty > 0) {
                if (!this.preventQtyChange) {
                    qty -= 1;
                }
                this.$emit('update:modelValue', qty);
                this.$emit('onQtyDecrease', qty);
            }
        },
    }
})
</script>

<template>
    <div>
        <button class="button" :class="buttonClass" @click="decreaseQty">
            <span class="icon">
                <i class="fa-solid fa-minus"></i>
            </span>
        </button>
        <button class="button" :class="buttonClass">
            {{ modelValue }}
        </button>
        <button class="button" :class="buttonClass" @click="increaseQty">
            <span class="icon">
                <i class="fa-solid fa-plus"></i>
            </span>
        </button>
    </div>
</template>

<style scoped>

</style>