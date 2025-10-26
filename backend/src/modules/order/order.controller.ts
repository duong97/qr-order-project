import {BaseController} from '@/core/base/base.controller';
import {OrderService} from './order.service';
import {NextFunction, Request, Response} from "express";
import {ORDER_SCENARIOS, ORDER_STATUSES} from "@/core/const/default";
import {OrderModel} from "@/modules/order/order.model";

export class OrderController extends BaseController<OrderService> {
    constructor() {
        super(new OrderService());
    }

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const scenario = ORDER_SCENARIOS.LIST;

            const queryStatus = String(req.query?.status || '');
            let filterStatus = queryStatus?.split(',').map(Number);

            const queryParams = {
                where: {
                    orderStatus: {in: filterStatus?.length ? filterStatus : ORDER_STATUSES.NEW}
                }
            } as any;
            queryParams.include = OrderModel.getRelations(scenario);
            queryParams.orderBy = { id: 'desc' }
            console.log('queryParams', JSON.stringify(queryParams));
            const data = await this.service.getAll(queryParams);
            const orders = data.map(order => {
                const orderModel = new OrderModel(order);
                return orderModel.toJSON(scenario);
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
        const orderId = +req.params.id;

        // Confirm order
        const orderUpdated = await this.service.confirm(orderId, req.currentUser?.id);

        // Return data with format
        const orderModel = new OrderModel(orderUpdated);
        res.status(200).json({ success: true, data: orderModel.toJSON(ORDER_SCENARIOS.LIST) });
    }

    complete = async (req: Request, res: Response, next: NextFunction) => {
        const orderId = +req.params.id;

        // Complete order
        const orderUpdated = await this.service.complete(orderId, req.currentUser?.id);

        // Return data with format
        const orderModel = new OrderModel(orderUpdated);
        res.status(200).json({ success: true, data: orderModel.toJSON(ORDER_SCENARIOS.LIST) });
    }

    cancel = async (req: Request, res: Response, next: NextFunction) => {
        const orderId = +req.params.id;

        // Cancel order
        const orderUpdated = await this.service.cancel(orderId, req.currentUser?.id);

        // Return data with format
        const orderModel = new OrderModel(orderUpdated);
        res.status(200).json({ success: true, data: orderModel.toJSON(ORDER_SCENARIOS.LIST) });
    }
}
