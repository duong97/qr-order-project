import {NextFunction, Request, Response} from "express";
import {PublicService} from "@/modules/public/public.service";

export class PublicController {
    protected service: PublicService;

    constructor() {
        this.service = new PublicService();
    }

    products = async (req: Request, res: Response, next: NextFunction) => {
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
            const data = await this.service.products(queryParams);
            const mappedData = data.map((product: any) => ({
                ...product,
                categories: product.categories?.map((category: any) => category.id),
                options: product.options?.map((option: any) => option.id),
            }));
            res.json({success: true, data: mappedData});
        } catch (err) {
            next(err);
        }
    };

    categories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.service.categories({});
            res.json({success: true, data});
        } catch (err) {
            next(err);
        }
    };
}
