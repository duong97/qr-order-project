import CartItemVariant from "@/interface/CartItemVariant";

export default interface CartItem {
    id?: number|string, // product id
    variants: CartItemVariant[],
}