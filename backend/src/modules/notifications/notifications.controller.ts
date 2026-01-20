import { Controller, Get, Post, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getMyNotifications(@Request() req: any) {
        return this.notificationsService.getUserNotifications(req.user.id);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        const count = await this.notificationsService.getUnreadCount(req.user.id);
        return { count };
    }

    @Patch(':id/read')
    async markAsRead(@Request() req: any, @Param('id') id: string) {
        await this.notificationsService.markAsRead(id, req.user.id);
        return { success: true };
    }

    @Patch('read-all')
    async markAllAsRead(@Request() req: any) {
        await this.notificationsService.markAllAsRead(req.user.id);
        return { success: true };
    }
}
