import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from './domain/project.entity';
import { Task } from './domain/task.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { DailyCheckIn } from '../presence/domain/daily-checkin.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(DailyCheckIn)
        private checkInRepository: Repository<DailyCheckIn>,
        private dataSource: DataSource,
    ) { }

    async getActiveContributors(projectId: string, tenantId: string): Promise<any[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);
            const today = new Date().toISOString().split('T')[0];
            const checkIns = await queryRunner.manager.find(DailyCheckIn, {
                where: { projectId, date: today },
                relations: ['user'],
            });
            return checkIns.map(ci => ci.user);
        } finally {
            await queryRunner.release();
        }
    }

    async createTask(tenantId: string, assignerId: string, dto: any): Promise<Task> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const task = this.taskRepository.create({
                ...dto,
                tenantId,
                assignerId,
            });
            const saved = (await queryRunner.manager.save(task)) as unknown as Task;
            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getTasksByProject(projectId: string, tenantId: string): Promise<Task[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            return await queryRunner.manager.find(Task, {
                where: { projectId },
                relations: ['assignee', 'assigner'],
                order: { createdAt: 'DESC' },
            });
        } finally {
            await queryRunner.release();
        }
    }

    async createProject(tenantId: string, dto: CreateProjectDto, isAdmin: boolean): Promise<Project> {
        if (!isAdmin) {
            throw new ForbiddenException('Only admins can create projects');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const project = this.projectRepository.create({
                ...dto,
                tenantId,
                status: 'active',
            });

            const savedProject = await queryRunner.manager.save(Project, project);
            await queryRunner.commitTransaction();
            return savedProject;
        } catch (err: any) {
            await queryRunner.rollbackTransaction();
            console.error('[createProject] ERROR:', err.message);
            console.error('[createProject] CODE:', err.code);
            console.error('[createProject] DETAIL:', err.detail);
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async getAllProjects(tenantId: string): Promise<Project[]> {
        console.log(`[ProjectsService] Getting projects for tenantId: ${tenantId}`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            // DEBUG: Count total raw projects to verify DB content
            const totalProjects = await this.dataSource.query('SELECT count(*) from projects');
            console.log(`[DEBUG] Total projects in DB (raw SQL):`, totalProjects[0].count);

            const tenantProjects = await this.dataSource.query(`SELECT count(*) from projects WHERE tenant_id = '${tenantId}'`);
            console.log(`[DEBUG] Projects for tenant ${tenantId} (raw SQL):`, tenantProjects[0].count);

            const projects = await queryRunner.manager.find(Project, {
                where: { status: 'active' },
                relations: ['owner'],
            });

            console.log(`[ProjectsService] Found ${projects.length} projects via ORM`);
            return projects;

        } finally {
            await queryRunner.release();
        }
    }


    async getProjectById(id: string): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['owner'],
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async findOne(id: string, tenantId: string): Promise<Project | null> {
        return this.projectRepository.findOne({
            where: { id, tenantId },
            relations: ['owner'],
        });
    }

    async archiveProject(id: string, isAdmin: boolean): Promise<Project> {
        if (!isAdmin) {
            throw new ForbiddenException('Only admins can archive projects');
        }

        const project = await this.getProjectById(id);
        project.status = 'archived';
        return this.projectRepository.save(project);
    }

    async updateTask(taskId: string, tenantId: string, updates: Partial<Task>): Promise<Task> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET app.current_tenant = '${tenantId}'`);

            const task = await queryRunner.manager.findOne(Task, { where: { id: taskId } });
            if (!task) {
                throw new NotFoundException('Task not found');
            }

            Object.assign(task, updates);
            const saved = await queryRunner.manager.save(task);
            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
    async updateProject(id: string, tenantId: string, updates: Partial<Project>, isAdmin: boolean): Promise<Project> {
        if (!isAdmin) {
            throw new ForbiddenException('Only admins can update projects');
        }

        const project = await this.findOne(id, tenantId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        Object.assign(project, updates);
        return this.projectRepository.save(project);
    }
}
