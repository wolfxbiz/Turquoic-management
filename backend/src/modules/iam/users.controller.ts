import { Controller, Get, Post, Patch, Body, UseGuards, Req, ForbiddenException, Delete, Param } from '@nestjs/common';
import { IamService } from './iam.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly iamService: IamService) { }

    @Get()
    @UseGuards(AdminGuard)
    async findAll(@Req() req: any) {
        return this.iamService.getAllUsers(req.user.tenantId);
    }

    @Post('register')
    @UseGuards(AdminGuard)
    async register(
        @Req() req: any,
        @Body('email') email: string,
        @Body('fullName') fullName: string,
        @Body('passwordHash') passwordHash: string,

        @Body('isAdmin') isAdmin: boolean = false,
        @Body('teamId') teamId?: string,
        @Body('jobTitle') jobTitle?: string,
        @Body('avatarUrl') avatarUrl?: string,
    ) {
        return this.iamService.createUser({
            email,
            fullName,
            passwordHash,
            isAdmin,
            teamId,
            jobTitle,
            avatarUrl,
            tenantId: req.user.tenantId,
        });
    }

    @Patch('profile')
    async updateProfile(
        @CurrentUser() user: CurrentUserDto,
        @Body() body: any,
    ) {
        const { isAdmin, tenantId, ...updates } = body; // Prevent updating sensitive fields
        return this.iamService.updateUser(user.userId, user.tenantId, updates);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async deactivate(@Req() req: any, @Param('id') id: string) {
        return this.iamService.deactivateUser(id, req.user.tenantId);
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: any,
    ) {
        return this.iamService.updateUser(id, req.user.tenantId, body);
    }
}
