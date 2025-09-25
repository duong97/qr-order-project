import CartItem from "@/interface/CartItem";

export default interface OrderSubmit {
    tableName?: string,
    customerName?: string,
    items?: CartItem[]
}