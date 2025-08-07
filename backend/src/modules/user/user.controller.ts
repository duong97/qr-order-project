import {BaseController} from '@/core/base/base.controller';
import {UserService} from './user.service';
import {UserRepository} from './user.repository';
import {NextFunction, Request, Response} from "express";
import {AuthError} from "@/core/middleware/errorHandler";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController extends BaseController<UserService> {
    constructor() {
        super(new UserService(new UserRepository()));
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.service.findByUsername(req.body.username);
        if (!user) {
            return next(new AuthError('User not found'))
        }

        const isMatch = bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return next(new AuthError('Wrong password'))
        }

        const secret = process.env.JWT_SECRET || 'default_secret'
        const expiresIn ='24h';
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn });
        res.json({success: true, data: { token, expiresIn }});
    };
}
