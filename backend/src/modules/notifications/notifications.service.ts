import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './domain/notification.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) { }

    async create(
        userId: string,
        tenantId: string,
        type: NotificationType,
        title: string,
        message: string,
        metadata: any = {}
    ): Promise<Notification> {
        const notification = this.notificationRepository.create({
            userId,
            tenantId,
            type,
            title,
            message,
            metadata,
        });
        return this.notificationRepository.save(notification);
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50, // Limit history
        });
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.notificationRepository.count({
            where: { userId, isRead: false },
        });
    }

    async markAsRead(id: string, userId: string): Promise<void> {
        await this.notificationRepository.update({ id, userId }, { isRead: true });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
    }
}
