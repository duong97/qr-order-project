import ProductOption from "@/interface/ProductOption";

export default interface CartItemVariant {
    id: string, // unique string
    qty: number,
    note?: string,
    price: number,
    itemOptions: ProductOption[];
}