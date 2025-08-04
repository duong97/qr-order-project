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
}
