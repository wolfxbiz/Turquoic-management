import { Controller, Post, Get, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import { UpdateOutcomeDto } from './dto/update-outcome.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../common/decorators/current-user.decorator';

@Controller('check-ins')
export class PresenceController {
    constructor(private presenceService: PresenceService) { }

    @Post()
    createCheckIn(
        @CurrentUser() user: CurrentUserDto,
        @Body() dto: CreateCheckInDto,
    ) {
        return this.presenceService.createCheckIn(user.userId, user.tenantId, dto);
    }

    @Get('today')
    getTodayCheckIn(@CurrentUser() user: CurrentUserDto) {
        return this.presenceService.getTodayCheckIn(user.userId);
    }

    @Patch(':id/outcome')
    updateOutcome(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserDto,
        @Body() dto: UpdateOutcomeDto,
    ) {
        return this.presenceService.updateOutcome(id, user.userId, user.tenantId, dto);
    }

    @Get('history')
    getHistory(
        @CurrentUser() user: CurrentUserDto,
        @Query('days', new ParseIntPipe({ optional: true })) days: number = 7,
    ) {
        return this.presenceService.getUserHistory(user.userId, days);
    }

    @Get('blocker-heatmap')
    getBlockerHeatmap(@CurrentUser() user: CurrentUserDto) {
        return this.presenceService.getBlockerHeatmap(user.tenantId);
    }

    @Get('summary')
    getSummary(@CurrentUser() user: CurrentUserDto) {
        return this.presenceService.getPresenceSummary(user.tenantId);
    }

    @Post('checkout')
    checkout(@CurrentUser() user: CurrentUserDto) {
        return this.presenceService.checkout(user.userId, user.tenantId);
    }
}


