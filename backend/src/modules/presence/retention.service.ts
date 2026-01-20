import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { DailyCheckIn } from './domain/daily-checkin.entity';
import { DailyOutcome } from './domain/daily-outcome.entity';


@Injectable()
export class RetentionService {
    private readonly logger = new Logger(RetentionService.name);

    constructor(
        @InjectRepository(DailyCheckIn)
        private checkInRepository: Repository<DailyCheckIn>,
        @InjectRepository(DailyOutcome)
        private outcomeRepository: Repository<DailyOutcome>,
    ) { }

    // Run every day at midnight
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCleanup() {
        this.logger.log('Starting 30-day data retention cleanup...');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Format as YYYY-MM-DD for the string date column
        const dateString = thirtyDaysAgo.toISOString().split('T')[0];

        try {
            // 1. Find check-ins to delete
            const oldCheckIns = await this.checkInRepository.find({
                where: {
                    date: LessThan(dateString),
                },
                select: ['id'],
            });

            if (oldCheckIns.length === 0) {
                this.logger.log('No old data found to clean up.');
                return;
            }

            const ids = oldCheckIns.map(c => c.id);

            // 2. Delete outcomes first (due to foreign key)
            await this.outcomeRepository.delete({
                checkInId: ids as any, // TypeORM handles array in delete
            });

            // 3. Delete check-ins
            const result = await this.checkInRepository.delete(ids);

            this.logger.log(`Successfully purged ${result.affected} records older than 30 days.`);
        } catch (error) {
            this.logger.error('Failed to perform data retention cleanup', error.stack);
        }
    }
}
