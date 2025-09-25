import {Router} from 'express';
import {PublicController} from "@/modules/public/public.controller";
import {validate} from "@/core/middleware/validate";
import {OrderValidator} from "@/modules/order/order.validator";

const router = Router();

// Public router
const _publicController = new PublicController();
router.get('/public/products', _publicController.products?.bind(_publicController));
router.get('/public/categories', _publicController.categories?.bind(_publicController));

// Order
const orderValidator = new OrderValidator();
router.post('/public/orders', [validate(orderValidator.onCreate)], _publicController.submitOrder?.bind(_publicController));

export default router;
