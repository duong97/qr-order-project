import { Router } from 'express';
import { CategoryController } from '@/modules/category/category.controller';

const router = Router();

const routes = [
    { path: '/categories', controller: new CategoryController() },
    // { path: '/menus', controller: new MenuController() }, // Thêm nữa ở đây
];

for (const route of routes) {
    const { path, controller } = route;
    const subRouter = Router();

    // Nếu controller tuân thủ chuẩn method (index, show, store, update, destroy)
    subRouter.get('/', controller.index?.bind(controller));
    subRouter.get('/:id', controller.show?.bind(controller));
    subRouter.post('/', controller.store?.bind(controller));
    subRouter.put('/:id', controller.update?.bind(controller));
    subRouter.delete('/:id', controller.destroy?.bind(controller));

    router.use(path, subRouter);
}

export default router;
