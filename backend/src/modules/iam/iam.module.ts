import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Tenant } from './domain/tenant.entity';
import { IamService } from './iam.service';
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Tenant])],
    providers: [IamService],
    controllers: [UsersController],
    exports: [IamService],
})

export class IamModule { }
