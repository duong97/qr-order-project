import {BaseService} from '@/core/base/base.service';
import {UserRepository} from './user.repository';
import {AppError, ValidationError} from "@/core/middleware/errorHandler";
import bcrypt from "bcrypt";
import {UserDTO} from "@/modules/user/user.dto";

export class UserService extends BaseService<UserRepository> {
    constructor() {
        super(new UserRepository());
    }

    async create(data: UserDTO) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        if (data.username) {
            const existing = await this.repository.findByUsername(data.username);
            if (existing) throw new ValidationError([
                {path: ['name'], message: 'Username already exists'},
            ]);
        }
        const createdUser = await this.repository.create(data);

        if (!createdUser?.id) throw new AppError("Create user failed!");

        return {
            id: createdUser.id,
            username: createdUser.username,
        }
    }

    async update(id: number, data: UserDTO) {
        if (data.username) {
            const existing = await this.repository.findByUsername(data.username);
            if (existing && existing.id !== id) throw new ValidationError([
                {path: ['name'], message: 'Username already exists'},
            ]);
        }
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
