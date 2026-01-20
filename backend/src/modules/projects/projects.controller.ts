import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../common/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Post()
    async createProject(
        @CurrentUser() user: CurrentUserDto,
        @Body() dto: CreateProjectDto,
    ) {
        console.log('Project creation attempt:', { user, dto });
        try {
            return await this.projectsService.createProject(user.tenantId, dto, user.isAdmin);
        } catch (error) {
            console.error('Project creation error:', error);
            throw error;
        }
    }


    @Get()
    getAllProjects(
        @CurrentUser() user: CurrentUserDto,
    ) {
        console.log('Getting projects for user:', user);
        return this.projectsService.getAllProjects(user.tenantId);
    }



    @Get(':id')
    getProjectById(@Param('id') id: string) {
        return this.projectsService.getProjectById(id);
    }

    @Get(':id/contributors')
    getContributors(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.projectsService.getActiveContributors(id, user.tenantId);
    }

    @Get(':id/tasks')
    getTasks(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.projectsService.getTasksByProject(id, user.tenantId);
    }

    @Post(':id/tasks')
    createTask(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserDto,
        @Body() dto: any,
    ) {
        return this.projectsService.createTask(user.tenantId, user.userId, { ...dto, projectId: id });
    }

    @Patch(':id/archive')

    archiveProject(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserDto,
    ) {
        return this.projectsService.archiveProject(id, user.isAdmin);
    }

    @Patch('tasks/:taskId')
    updateTask(
        @Param('taskId') taskId: string,
        @CurrentUser() user: CurrentUserDto,
        @Body() updates: any,
    ) {
        return this.projectsService.updateTask(taskId, user.tenantId, updates);
    }
}
