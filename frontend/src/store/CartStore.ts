import { defineStore } from 'pinia'
import CartItem from "@/interface/CartItem";
import {ref, watch} from "vue";
import CartItemVariant from "@/interface/CartItemVariant";
import ProductOption from "@/interface/ProductOption";
import config from "@/config";
import {initializeApp} from "firebase/app";
import {getDatabase, push, ref as firebaseRef} from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
        return false;
        const firebaseConfig = config.firebaseConfig;
        const app = initializeApp(firebaseConfig);

        if (items.value.length === 0) {
            return false;
        }

        // Initialize Firebase Authentication and get a reference to the service
        const auth = getAuth(app);
        return await signInWithEmailAndPassword(auth, config.firebaseAuth.email, config.firebaseAuth.password)
            .then(async () => {
                // Initialize Realtime Database and get a reference to the service
                const database = getDatabase(app);
                const orderPath = ['orders', tableName].join('/')
                const orderRefs = firebaseRef(database, orderPath);

                // Save order
                const order = {
                    customerName: customerName || 'Anonymous',
                    items: items.value
                }
                await push(orderRefs, order).then(() => {
                    clearCart();
                });
                return true;
            })
            .catch(() => {
                // console.error("Error signing in: ", error);
                console.error("Error in prepare order!");
                return false;
            });
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