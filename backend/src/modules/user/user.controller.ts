import {BaseController} from '@/core/base/base.controller';
import {UserService} from './user.service';
import {NextFunction, Request, Response} from "express";
import {AuthError} from "@/core/middleware/errorHandler";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController extends BaseController<UserService> {
    constructor() {
        super(new UserService());
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.service.findByUsername(req.body.username);
        if (!user) {
            return next(new AuthError('User not found'))
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return next(new AuthError('Wrong password'))
        }

        const secret = process.env.JWT_SECRET || 'default_secret'
        const expiresIn ='24h';
        const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn });
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username
                },
                token,
                expiresIn
            }
        });
    };

    currentUserInfo = async (req: Request, res: Response, next: NextFunction) => {
        res.json({
            success: true,
            data: {
                message: 'Authenticated successfully',
            }
        });
    };
}
