import { defineStore } from 'pinia'
import CartItem from "@/interface/CartItem";
import {ref, watch} from "vue";
import CartItemVariant from "@/interface/CartItemVariant";
import ProductOption from "@/interface/ProductOption";
import {PublicApi} from "@/api/public/PublicApi";
import OrderSubmit from "@/interface/OrderSubmit";

const publicApi = new PublicApi();

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([]);

    const loadFromLocalStorage = () => {
        const savedItems = localStorage.getItem('cartItems');
        if (savedItems) {
            items.value = JSON.parse(savedItems);
        }
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('cartItems', JSON.stringify(items.value));
    };

    // Load initial state from localStorage
    loadFromLocalStorage();

    // Watch for changes to items and save them to localStorage
    watch(items, saveToLocalStorage, { deep: true });

    const totalItems = () => items.value.reduce((acc, item) => {
            return acc + item.variants.reduce((acc2, item2) => {
                return acc2 + item2.qty;
            }, 0);
        }, 0);

    const totalVariants = (itemId: number) => {
        return items.value.filter(i => i.id === itemId).reduce((acc, item) => {
            return acc + item.variants.reduce((acc2, item2) => {
                return acc2 + item2.qty;
            }, 0);
        }, 0);
    }

    const totalVariantAmount = (itemId: number, variantId: string) => {
        const cartItem = items.value
            .find((variant) => variant.id === itemId);
        if (!cartItem || cartItem.variants.length == 0) {
            return 0;
        }

        const variant = cartItem.variants
            .find(v => v.id === variantId);
        if (!variant) {
            return 0;
        }

        return variant.qty * (variant.price + variant.itemOptions.reduce((optionTotal, option) => {
            return optionTotal + option.items.reduce((optionItemTotal, optionItem) => {
                return optionItemTotal + optionItem.price;
            }, 0)
        }, 0));
    }

    const totalAmount = () => items.value.reduce((acc, item: CartItem) => {
        return acc + item.variants.reduce((acc2, item2: CartItemVariant) => {
            return acc2 + item2.qty * (item2.price + item2.itemOptions.reduce((acc3, item3: ProductOption) => {
                return acc3 + item3.items.reduce((acc4, item4) => {
                    return acc4 + item4.price;
                }, 0)
            }, 0));
        }, 0);
    }, 0);

    const addItem = (cartItem: CartItem) => {
        const existingProduct = items.value.find(item => item.id === cartItem.id);
        if (existingProduct) {
            existingProduct.variants = existingProduct.variants.concat(cartItem.variants);
        } else {
            items.value.push(cartItem);
        }
    }

    const removeItem = (cartItemId: string) => {
        items.value = items.value.filter(cartItem => cartItem.id !== cartItemId);
    }

    const removeItemVariant = (itemId: number, variantId: string) => {
        items.value = items.value.map((variant) => {
            if (variant.id === itemId) {
                variant.variants = variant.variants.filter(i => i.id != variantId);
            }
            return variant;
        }).filter(i => i.variants.length > 0);
    }

    const clearCart = () => {
        items.value = [];
    }

    const hasItems = () => {
        return items.value.length > 0;
    }

    const submitOrder = async (tableName: string, customerName: string) => {
        if (items.value.length === 0) {
            return false;
        }

        // Submit order
        const order = {
            tableName,
            customerName: customerName,
            items: items.value
        } as OrderSubmit;

        const orderSubmitted = await publicApi.submitOrder(order);
        if (orderSubmitted?.success) {
            // clearCart();
            return true;
        }

        return false;
    }

    return {
        items,
        addItem,
        removeItem,
        removeItemVariant,
        clearCart,
        totalItems,
        totalVariants,
        totalVariantAmount,
        totalAmount,
        hasItems,
        submitOrder,
    };
});