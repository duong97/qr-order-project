import {BaseController} from '@/core/base/base.controller';
import {ProductService} from './product.service';
import {NextFunction, Request, Response} from "express";

export class ProductController extends BaseController<ProductService> {
    constructor() {
        super(new ProductService());
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
                },
                options: {
                    select: {
                        id: true,
                    },
                }
            };
            const data = await (this.service as any).getAll(queryParams);
            const mappedData = data.map((product: { categories: any[]; options: any[]; }) => ({
                ...product,
                categories: product.categories.map((category) => category.id),
                options: product.options.map((option) => option.id),
            }));
            res.json({success: true, data: mappedData});
        } catch (err) {
            next(err);
        }
    };

    store = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {name, price, description, categories, options} = req.body;
            const dataCreate = {name, price, description, categories: {}, options: {}, createdBy: req.currentUser?.id};
            if (categories?.length) {
                dataCreate.categories = {
                    connect: categories.map((category: number) => {
                        return { id: category }
                    }),
                }
            }
            if (options?.length) {
                dataCreate.options = {
                    connect: options.map((option: number) => {
                        return { id: option }
                    }),
                }
            }
            const data = await (this.service as any).create(dataCreate);
            res.status(201).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = +req.params.id;
            const {name, price, description, categories, options} = req.body;
            const dataUpdate = {name, price, description, categories: {}, options: {}};
            if (categories?.length) {
                dataUpdate.categories = {
                    connect: categories.map((category: number) => {
                        return { id: category }
                    }),
                }
            }
            if (options?.length) {
                dataUpdate.options = {
                    connect: options.map((option: number) => {
                        return { id: option }
                    }),
                }
            }
            console.log('dataUpdate', dataUpdate);
            const data = await (this.service as any).update(id, dataUpdate);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };
}
