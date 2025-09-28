import {BaseController} from '@/core/base/base.controller';
import {OrderService} from './order.service';
import {NextFunction, Request, Response} from "express";

export class OrderController extends BaseController<OrderService> {
    constructor() {
        super(new OrderService());
    }

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryParams = {...req.query} as any;
            queryParams.include = {
                details: true
            };
            const data = await (this.service as any).getAll(queryParams);
            res.json({success: true, data});
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
}
