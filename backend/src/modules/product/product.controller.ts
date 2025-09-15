import {BaseController} from '@/core/base/base.controller';
import {ProductService} from './product.service';
import {ProductRepository} from './product.repository';
import {NextFunction, Request, Response} from "express";

export class ProductController extends BaseController<ProductService> {
    constructor() {
        super(new ProductService(new ProductRepository()));
    }

    // override hoặc thêm action riêng nếu cần
    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryParams = {...req.query} as any;
            queryParams.include = {
                categories: {
                    select: {
                        id: true,
                    },
                }
            };
            const data = await (this.service as any).getAll(queryParams);
            const mappedData = data.map((product: { categories: any[]; }) => ({
                ...product,
                categories: product.categories.map((category) => category.id),
            }));
            res.json({success: true, data: mappedData});
        } catch (err) {
            next(err);
        }
    };

    store = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyData = {...req.body};
            bodyData.createdBy = req.currentUser?.id;
            if (bodyData.category) {
                bodyData.categories = {
                    connect: { id: bodyData.category }
                }
            }
            console.log('debug 2', bodyData);
            const data = await (this.service as any).create(bodyData);
            res.status(201).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = +req.params.id;
            const {name, price, description, categories} = req.body;
            const dataCreate = {name, price, description, categories: {}};
            if (categories?.length) {
                dataCreate.categories = {
                    connect: categories.map((category: number) => {
                        return { id: category }
                    }),
                }
            }
            const data = await (this.service as any).update(id, dataCreate);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };
}
