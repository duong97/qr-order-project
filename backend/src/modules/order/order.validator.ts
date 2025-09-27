import {z} from 'zod';
import {BaseValidator} from "@/core/base/base.validator";

// Các biến thể của sản phẩm
const OrderProductVariantSchema = z.object({
    id: z.any(), // product id
    price: z.number().int(),
    qty: z.number().int().default(1),
    note: BaseValidator.mustBeString(),
    itemOptions: z.array(z.any()).optional() // vd Lượng đường 50%, Đá 100%...
});

// Sản phẩm chính
const OrderProductSchema = z.object({
    id: z.number().int(), // product id
    variants: z.array(OrderProductVariantSchema).optional() // Danh sách biến thể
});

// Đơn hàng
export const OrderSchema = z.object({
    tableName: BaseValidator.mustBeString(),
    tableId: BaseValidator.mustBeNumber(),
    customerName: BaseValidator.mustBeString(),
    note: BaseValidator.mustBeString(),
    items: z.array(OrderProductSchema).optional(),
});

export type OrderInput = z.infer<typeof OrderSchema>;

export class OrderValidator extends BaseValidator {
    onCreate = OrderSchema
    onUpdate = OrderSchema
}