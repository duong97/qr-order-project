import {Router} from 'express';
import {authMiddleware} from '@/core/middleware/authMiddleware';
import {validate} from '@/core/middleware/validate';
import {CategoryValidator} from '@/modules/category/category.validator';
import {ProductValidator} from "@/modules/product/product.validator";
import {UserValidator} from "@/modules/user/user.validator";
import {CategoryController} from '@/modules/category/category.controller';
import {ProductController} from "@/modules/product/product.controller";
import {UserController} from "@/modules/user/user.controller";

const router = Router();
router.use(authMiddleware);

const routes = [
    {path: '/categories', controller: new CategoryController(), validator: new CategoryValidator()},
    {path: '/products', controller: new ProductController(), validator: new ProductValidator()},
    {path: '/users', controller: new UserController(), validator: new UserValidator()},
];

for (const route of routes) {
    const {path, controller, validator} = route;
    const _router = Router();

    // CRUD router
    _router.get('/', controller.index?.bind(controller));
    _router.get('/:id', controller.show?.bind(controller));
    _router.post('/', [validate(validator.onCreate)], controller.store?.bind(controller));
    _router.put('/:id', [validate(validator.onUpdate)], controller.update?.bind(controller));
    _router.delete('/:id', [validate(validator.onDelete)], controller.destroy?.bind(controller));

    router.use(path, _router);
}

export default router;
