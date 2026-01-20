import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { PresenceModule } from '../presence/presence.module';

@Module({
    imports: [PresenceModule],
    controllers: [DashboardController],
})
export class DashboardModule { }
