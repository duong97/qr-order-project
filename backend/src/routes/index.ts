import { Router } from 'express';
import { CategoryController } from '@/modules/category/category.controller';
import { authMiddleware } from '@/core/middleware/authMiddleware';
import { validate } from '@/core/middleware/validate';
import { createCategorySchema } from '@/modules/category/category.validator';

const router = Router();

const routes = [
    { path: '/categories', controller: new CategoryController(), validateMiddleware: validate(createCategorySchema) },
    // { path: '/menus', controller: new MenuController() }, // Thêm nữa ở đây
];

for (const route of routes) {
    const { path, controller, validateMiddleware } = route;
    const subRouter = Router();
    const middlewares = [authMiddleware, validateMiddleware];

    subRouter.get('/', middlewares, controller.index?.bind(controller));
    subRouter.get('/:id', middlewares, controller.show?.bind(controller));
    subRouter.post('/', middlewares, controller.store?.bind(controller));
    subRouter.put('/:id', middlewares, controller.update?.bind(controller));
    subRouter.delete('/:id', middlewares, controller.destroy?.bind(controller));

    router.use(path, subRouter);
}

export default router;
