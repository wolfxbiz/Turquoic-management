import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './domain/project.entity';
import { Task } from './domain/task.entity';
import { DailyCheckIn } from '../presence/domain/daily-checkin.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, Task, DailyCheckIn])],


    providers: [ProjectsService],
    controllers: [ProjectsController],
    exports: [ProjectsService],
})
export class ProjectsModule { }
