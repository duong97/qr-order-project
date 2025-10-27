import { Request, Response, NextFunction } from 'express';

export abstract class BaseController<TService> {
    protected service: TService;

    protected constructor(service: TService) {
        this.service = service;
    }

    // GET /resource
    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await (this.service as any).getAll(req.query);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    // GET /resource/:id
    show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = +req.params.id;
            const data = await (this.service as any).getById(id);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    // POST /resource
    store = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyData = req.body;
            bodyData.createdBy = req.currentUser?.id;
            const data = await (this.service as any).create(bodyData);
            res.status(201).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    // POST /resource
    createMultiple = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyData = req.body;
            if (!Array.isArray(bodyData)) {
                return res.status(400).json({ success: false, message: 'Invalid data format' });
            }

            const result = [];
            for (const item of bodyData) {
                item.createdBy = req.currentUser?.id;
                const _createdData = await (this.service as any).create(bodyData);
                result.push(_createdData);
            }
            res.status(201).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    };

    // PUT /resource/:id
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = +req.params.id;
            const bodyData = req.body;
            const data = await (this.service as any).update(id, bodyData);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    // DELETE /resource/:id
    destroy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = +req.params.id;
            const data = await (this.service as any).delete(id);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };
}
