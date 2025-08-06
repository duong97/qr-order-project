import {BaseController} from '@/core/base/base.controller';
import {UserService} from './user.service';
import {UserRepository} from './user.repository';
import {NextFunction, Request, Response} from "express";

export class UserController extends BaseController<UserService> {
    constructor() {
        super(new UserService(new UserRepository()));
    }

    // override hoặc thêm action riêng nếu cần
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json({success: true, data: 1});
        } catch (err) {
            next(err);
        }
    };
}
