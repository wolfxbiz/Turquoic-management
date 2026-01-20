import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Get()
    findAll(@Req() req: any) {
        return this.teamsService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.teamsService.findOne(id, req.user.tenantId);
    }

    @Post()
    @UseGuards(AdminGuard)
    create(@Req() req: any, @Body('name') name: string, @Body('description') description?: string) {
        return this.teamsService.create(req.user.tenantId, name, description);
    }

    @Post(':id/members/:userId')
    @UseGuards(AdminGuard)
    addMember(@Param('id') id: string, @Param('userId') userId: string, @Req() req: any) {
        return this.teamsService.addMember(id, userId, req.user.tenantId);
    }

    @Delete('members/:userId')
    @UseGuards(AdminGuard)
    removeMember(@Param('userId') userId: string, @Req() req: any) {
        return this.teamsService.removeMember(userId, req.user.tenantId);
    }
}


