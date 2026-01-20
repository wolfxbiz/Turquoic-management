import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './domain/user.entity';
import { Tenant } from './domain/tenant.entity';

@Injectable()
export class IamService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        private dataSource: DataSource,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { email },
            relations: ['team']
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            return user;
        }
        return null;
    }

    async createUser(data: Partial<User>): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${data.tenantId}'`);

            const existingUser = await queryRunner.manager.findOne(User, {
                where: { email: data.email }
            });
            if (existingUser) {
                throw new ConflictException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(data.passwordHash!, 10);
            const user = this.userRepository.create({
                ...data,
                passwordHash: hashedPassword,
            });

            const saved = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getAllUsers(tenantId: string): Promise<User[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);
            return await queryRunner.manager.find(User, {
                where: { tenantId },
                relations: ['team']
            });
        } finally {
            await queryRunner.release();
        }
    }

    async deactivateUser(id: string, tenantId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const user = await queryRunner.manager.findOne(User, {
                where: { id, tenantId }
            });
            if (!user) throw new ConflictException('User not found');

            user.isActive = false;
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async updateUser(id: string, tenantId: string, data: Partial<User>): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const user = await queryRunner.manager.findOne(User, {
                where: { id, tenantId }
            });
            if (!user) throw new ConflictException('User not found');

            if (data.passwordHash) {
                data.passwordHash = await bcrypt.hash(data.passwordHash, 10);
            }

            const updatedUser = this.userRepository.merge(user, data);
            const saved = await queryRunner.manager.save(updatedUser);
            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}

