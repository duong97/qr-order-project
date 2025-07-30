// src/core/base/base.controller.ts
import { Request, Response, NextFunction } from 'express';

export abstract class BaseController<TService> {
    protected service: TService;

    constructor(service: TService) {
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
            const data = await (this.service as any).create(req.body);
            res.status(201).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    // PUT /resource/:id
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const data = await (this.service as any).update(id, req.body);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };

    // DELETE /resource/:id
    destroy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const data = await (this.service as any).delete(id);
            res.json({ success: true, data });
        } catch (err) {
            next(err);
        }
    };
}
