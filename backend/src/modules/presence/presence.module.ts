import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { DailyCheckIn } from './domain/daily-checkin.entity';
import { DailyOutcome } from './domain/daily-outcome.entity';
import { RetentionService } from './retention.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProjectsModule } from '../projects/projects.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([DailyCheckIn, DailyOutcome]),
        NotificationsModule,
        ProjectsModule
    ],
    providers: [PresenceService, RetentionService],
    controllers: [PresenceController],
    exports: [PresenceService],
})
export class PresenceModule { }
