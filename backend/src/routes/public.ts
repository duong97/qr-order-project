import {Router} from 'express';
import {PublicController} from "@/modules/public/public.controller";

const router = Router();

// Public router
const _publicController = new PublicController();
router.get('/public/products', _publicController.products?.bind(_publicController));
router.get('/public/categories', _publicController.categories?.bind(_publicController));

export default router;
