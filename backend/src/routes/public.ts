import {Router} from 'express';
import {PublicController} from "@/modules/public/public.controller";
import {validate} from "@/core/middleware/validate";
import {OrderValidator} from "@/modules/order/order.validator";
import {RequestValidator} from "@/modules/request/request.validator";

const router = Router();

// Public router
const _publicController = new PublicController();
router.get('/public/products', _publicController.products?.bind(_publicController));
router.get('/public/categories', _publicController.categories?.bind(_publicController));

// Order
const orderValidator = new OrderValidator();
router.post('/public/orders', [validate(orderValidator.onCreate)], _publicController.submitOrder?.bind(_publicController));

// Request
const requestValidator = new RequestValidator();
router.post('/public/requests', [validate(requestValidator.onCreate)], _publicController.createRequest?.bind(_publicController));

export default router;
