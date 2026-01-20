import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { DailyCheckIn } from './domain/daily-checkin.entity';
import { DailyOutcome } from './domain/daily-outcome.entity';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';

@Injectable()
export class PresenceService {
    constructor(
        @InjectRepository(DailyCheckIn)
        private checkInRepository: Repository<DailyCheckIn>,
        @InjectRepository(DailyOutcome)
        private outcomeRepository: Repository<DailyOutcome>,
        private dataSource: DataSource,
    ) { }

    async createCheckIn(userId: string, tenantId: string, dto: CreateCheckInDto): Promise<DailyCheckIn> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const today = new Date().toISOString().split('T')[0];
            const existing = await queryRunner.manager.findOne(DailyCheckIn, {
                where: { userId, date: today },
            });

            if (existing) {
                throw new ConflictException('Already checked in for today');
            }

            const checkIn = this.checkInRepository.create({
                ...dto,
                userId,
                tenantId,
                date: today,
                checkedInAt: new Date(),
            });

            const saved = await queryRunner.manager.save(checkIn);
            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getTodayCheckIn(userId: string): Promise<DailyCheckIn | null> {
        const today = new Date().toISOString().split('T')[0];
        return this.checkInRepository.findOne({
            where: { userId, date: today },
            relations: ['project'],
        });
    }

    async updateOutcome(checkInId: string, userId: string, tenantId: string, dto: UpdateOutcomeDto): Promise<DailyOutcome> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const checkIn = await queryRunner.manager.findOne(DailyCheckIn, {
                where: { id: checkInId, userId },
            });

            if (!checkIn) {
                throw new NotFoundException('Check-in not found');
            }

            let outcome = await queryRunner.manager.findOne(DailyOutcome, {
                where: { checkInId },
            });

            if (outcome) {
                outcome.outcomeText = dto.outcomeText;
            } else {
                outcome = this.outcomeRepository.create({
                    checkInId,
                    tenantId,
                    outcomeText: dto.outcomeText,
                });
            }

            const saved = await queryRunner.manager.save(outcome);
            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getTodayAllCheckIns(tenantId: string, teamId?: string): Promise<DailyCheckIn[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const today = new Date().toISOString().split('T')[0];
            const query = queryRunner.manager.createQueryBuilder(DailyCheckIn, 'checkin')
                .leftJoinAndSelect('checkin.user', 'user')
                .leftJoinAndSelect('checkin.project', 'project')
                .where('checkin.date = :today', { today });

            if (teamId) {
                query.andWhere('user.team_id = :teamId', { teamId });
            }

            return query.getMany();
        } finally {
            await queryRunner.release();
        }
    }


    async getTodayBlockers(): Promise<DailyCheckIn[]> {
        const today = new Date().toISOString().split('T')[0];
        return this.checkInRepository.find({
            where: { date: today, isBlocked: true },
            relations: ['user', 'project'],
        });
    }

    async getUserHistory(userId: string, days: number): Promise<DailyCheckIn[]> {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const startDate = date.toISOString().split('T')[0];

        return this.checkInRepository.find({
            where: {
                userId,
                date: Between(startDate, new Date().toISOString().split('T')[0]),
            },
            order: { date: 'DESC' },
            relations: ['project'],
        });
    }

    async getBlockerHeatmap(tenantId: string): Promise<{ date: string; count: number }[]> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        const results = await this.checkInRepository
            .createQueryBuilder('checkin')
            .select('checkin.date', 'date')
            .addSelect('COUNT(checkin.id)', 'count')
            .where('checkin.tenant_id = :tenantId', { tenantId })
            .andWhere('checkin.date >= :startDate', { startDate })
            .andWhere('checkin.is_blocked = true')
            .groupBy('checkin.date')
            .orderBy('checkin.date', 'ASC')
            .getRawMany();

        return results.map(r => ({
            date: r.date,
            count: parseInt(r.count, 10),
        }));
    }
    async getPresenceSummary(tenantId: string): Promise<{ office: number; remote: number }> {
        const today = new Date().toISOString().split('T')[0];
        const results = await this.checkInRepository
            .createQueryBuilder('checkin')
            .select('checkin.location', 'location')
            .addSelect('COUNT(checkin.id)', 'count')
            .where('checkin.tenant_id = :tenantId', { tenantId })
            .andWhere('checkin.date = :today', { today })
            .groupBy('checkin.location')
            .getRawMany();

        const summary = { office: 0, remote: 0 };
        results.forEach(r => {
            if (r.location === 'office') summary.office = parseInt(r.count, 10);
            if (r.location === 'remote') summary.remote = parseInt(r.count, 10);
        });

        return summary;
    }

    async checkout(userId: string, tenantId: string): Promise<DailyCheckIn> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const today = new Date().toISOString().split('T')[0];
            const checkIn = await queryRunner.manager.findOne(DailyCheckIn, {
                where: { userId, date: today },
            });

            if (!checkIn) {
                throw new NotFoundException('No check-in found for today');
            }

            if (checkIn.checkedOutAt) {
                throw new ConflictException('Already checked out for today');
            }

            checkIn.checkedOutAt = new Date();
            const saved = await queryRunner.manager.save(checkIn);
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


