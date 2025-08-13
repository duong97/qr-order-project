import {BaseService} from '@/core/base/base.service';
import {UserRepository} from './user.repository';
import {AppError, ValidationError} from "@/core/middleware/errorHandler";
import bcrypt from "bcrypt";

export class UserService extends BaseService<UserRepository> {
    constructor(repository: UserRepository) {
        super(repository);
    }

    async create(data: any) {
        data.password = await bcrypt.hash(data.password, 10);
        const existing = await this.repository.findByUsername(data.username);
        if (existing) throw new ValidationError([
            {path: ['name'], message: 'Username already exists'},
        ]);
        const createdUser = await this.repository.create(data);

        if (!createdUser?.id) throw new AppError("Create user failed!");

        return {
            id: createdUser.id,
            username: createdUser.username,
        }
    }

    async update(id: number, data: any) {
        const existing = await this.repository.findByUsername(data.username);
        if (existing && existing.id !== id) throw new ValidationError([
            {path: ['name'], message: 'Username already exists'},
        ]);
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser = await this.repository.update(id, data);
        return {
            id: updatedUser.id,
            username: updatedUser.username,
        }
    }

    async findByUsername(username: string | null) {
        if (!username) {
            return null;
        }
        return await this.repository.findByUsername(username);
    }
}
