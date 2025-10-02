import {BaseController} from '@/core/base/base.controller';
import {OrderService} from './order.service';
import {NextFunction, Request, Response} from "express";
import {ORDER_STATUS_LABELS, ORDER_STATUSES} from "@/core/const/default";

export class OrderController extends BaseController<OrderService> {
    constructor() {
        super(new OrderService());
    }

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryParams = {...req.query} as any;
            queryParams.include = {
                details: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                thumbnail: true,
                            },
                        },
                    }
                },
                table: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                }
            };
            const data = await this.service.getAll(queryParams);
            const orders = data.map(order => {
                order.orderStatusLabel = ORDER_STATUS_LABELS[order.orderStatus] || 'Unknown';

                order.isNew = order.orderStatus === ORDER_STATUSES.NEW || order.orderStatus === null;
                order.isProcessing = order.orderStatus === ORDER_STATUSES.PROCESSING;
                order.isCompleted = order.orderStatus === ORDER_STATUSES.COMPLETED;
                order.isCancelled = order.orderStatus === ORDER_STATUSES.CANCELLED;

                order.canComplete = order.isNew || order.isProcessing;
                order.canCancel = order.isNew || order.isProcessing;
                return order;
            });
            res.json({success: true, data: orders});
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

    confirm = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        return await this.service.confirm(id);
    }

    complete = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        return await this.service.complete(id);
    }

    cancel = async (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        return await this.service.cancel(id);
    }
}
