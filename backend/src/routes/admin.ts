import {Router} from 'express';
import {authMiddleware} from '@/core/middleware/authMiddleware';
import {validate} from '@/core/middleware/validate';
import {CategoryValidator} from '@/modules/category/category.validator';
import {ProductValidator} from "@/modules/product/product.validator";
import {UserValidator} from "@/modules/user/user.validator";
import {CategoryController} from '@/modules/category/category.controller';
import {ProductController} from "@/modules/product/product.controller";
import {UserController} from "@/modules/user/user.controller";
import {OptionController} from "@/modules/option/option.controller";
import {OptionValidator} from "@/modules/option/option.validator";
import {OrderController} from "@/modules/order/order.controller";
import {OrderValidator} from "@/modules/order/order.validator";

const adminRouter = Router();
adminRouter.use(authMiddleware);
const routePrefix = '/admin';

const userController = new UserController();

// Another path (phải đưa path ngoại lệ lên trên, nếu ko thì path /:id sẽ match trước và không vào được router này)
adminRouter.get('/admin/users/current', userController.currentUserInfo?.bind(userController));

const routes = [
    {path: '/categories', controller: new CategoryController(), validator: new CategoryValidator()},
    {path: '/products', controller: new ProductController(), validator: new ProductValidator()},
    {path: '/options', controller: new OptionController(), validator: new OptionValidator()},
    {path: '/users', controller: userController, validator: new UserValidator()},
    {path: '/orders', controller: new OrderController, validator: new OrderValidator()},
];

for (const route of routes) {
    const {path, controller, validator} = route;
    const basePath = routePrefix + path;

    // CRUD router
    adminRouter.get(basePath, controller.index?.bind(controller));
    adminRouter.get(basePath + '/:id', controller.show?.bind(controller));
    adminRouter.post(basePath, [validate(validator.onCreate)], controller.store?.bind(controller));
    adminRouter.put(basePath + '/:id', [validate(validator.onUpdate)], controller.update?.bind(controller));
    adminRouter.delete(basePath + '/:id', [validate(validator.onDelete)], controller.destroy?.bind(controller));
}

export default adminRouter;
