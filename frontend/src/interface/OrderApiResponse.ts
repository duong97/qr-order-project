// Đơn hàng
export default interface OrderApiResponse {
    id?: number|null,
    code?: string|null,
    createdAt?: string|null,
    createdBy?: number|null,
    note?: string|null,
    orderStatus?: number|null,
    paymentStatus?: number|null,
    tableId?: number|null,
    totalAmount?: number|null,
    details?: OrderDetailApiResponse[]|null,
}

// Chi tiết đơn hàng (1 sp có thể có 2 detail)
export interface OrderDetailApiResponse {
    id?: number|null,
    note?: string|null,
    orderId?: number|null,
    price?: number|null,
    productId?: number|null,
    qty?: number|null,
    totalAmount?: number|null,
    productOptions?: OrderDetailProductOptionApiResponse[]|null,
    createdAt?: string|null,
    createdBy?: number|null,
}

// Tùy chọn của sản phẩm (lượng đá / lượng đường ...)
export interface OrderDetailProductOptionApiResponse {
    id?: number|null,
    name?: string|null,
    multiple?: boolean|null,
    items?: OrderDetailProductOptionItemApiResponse[]|null,
    selected?: number[]|null,
}

// Option của tùy chọn (vd 50% đá, 100% đá...)
export interface OrderDetailProductOptionItemApiResponse {
    id?: number|null,
    name?: string|null,
    price?: number|null,
}