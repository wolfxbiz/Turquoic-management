import { Controller, Get, Query } from '@nestjs/common';
import { PresenceService } from '../presence/presence.service';
import { WorkStatus } from '../presence/dto/create-checkin.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../common/decorators/current-user.decorator';

@Controller('dashboard')
export class DashboardController {
    constructor(private presenceService: PresenceService) { }

    @Get('presence')
    async getPresence(
        @CurrentUser() user: CurrentUserDto,
        @Query('teamId') teamId?: string
    ) {
        const checkIns = await this.presenceService.getTodayAllCheckIns(user.tenantId, teamId);


        const summary = {
            inOffice: checkIns.filter(c => c.status === WorkStatus.IN_OFFICE).length,
            remote: checkIns.filter(c => c.status === WorkStatus.REMOTE).length,
            onLeave: checkIns.filter(c => c.status === WorkStatus.ON_LEAVE).length,
            totalCheckedIn: checkIns.length,
            blocked: checkIns.filter(c => c.isBlocked).length,
        };

        return {
            summary,
            presenceList: checkIns.map(c => ({
                id: c.id,
                userName: c.user?.fullName,
                projectName: c.project?.name,
                status: c.status,
                intent: c.intent,
                isBlocked: c.isBlocked,
                blockReason: c.blockReasonText, // Compat
                blockReasonText: c.blockReasonText,
                blockReasonCategory: c.blockReasonCategory,
                helperUserId: c.helperUserId, // Optional, mostly hidden by FE
            })),
        };
    }

    @Get('blockers')
    async getBlockers() {
        const blockers = await this.presenceService.getTodayBlockers();
        return blockers.map(c => ({
            id: c.id,
            userName: c.user?.fullName,
            projectName: c.project?.name,
            blockReason: c.blockReasonText,
            blockReasonText: c.blockReasonText,
            blockReasonCategory: c.blockReasonCategory,
            intent: c.intent,
        }));
    }
}
