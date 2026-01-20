import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IamService } from './modules/iam/iam.service';
import { ProjectsService } from './modules/projects/projects.service';
import { DataSource } from 'typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const iamService = app.get(IamService);
    const projectsService = app.get(ProjectsService);
    const dataSource = app.get(DataSource);

    const defaultTenantId = '00000000-0000-0000-0000-000000000001';

    try {
        console.log('🌱 Starting database seeding...');

        // Set RLS context for the session
        await dataSource.query(`SET app.current_tenant = '${defaultTenantId}'`);

        // 1. Create Admin User
        const adminEmail = 'admin@company.com';
        let admin = await iamService.findByEmail(adminEmail);
        if (!admin) {
            admin = await iamService.createUser({
                email: adminEmail,
                passwordHash: 'admin123',
                fullName: 'System Admin',
                isAdmin: true,
                tenantId: defaultTenantId,
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // 2. Create Test Users
        const testUsers = [
            { email: 'alice@company.com', fullName: 'Alice Smith' },
            { email: 'bob@company.com', fullName: 'Bob Johnson' },
            { email: 'charlie@company.com', fullName: 'Charlie Brown' },
        ];

        for (const u of testUsers) {
            const existing = await iamService.findByEmail(u.email);
            if (!existing) {
                await iamService.createUser({
                    email: u.email,
                    passwordHash: 'password123',
                    fullName: u.fullName,
                    isAdmin: false,
                    tenantId: defaultTenantId,
                });
                console.log(`✅ User ${u.fullName} created`);
            }
        }

        // 3. Create Projects
        const projects = [
            { name: 'Client Portal Redesign', description: 'Modernizing the customer facing portal' },
            { name: 'API Migration', description: 'Moving legacy APIs to NestJS' },
            { name: 'Internal Tools', description: 'Building productivity tools for the team' },
        ];

        const allProjects = await projectsService.getAllProjects(defaultTenantId);
        for (const p of projects) {
            const existing = allProjects.find(proj => proj.name === p.name);
            if (!existing) {
                await projectsService.createProject(defaultTenantId, {
                    name: p.name,
                    description: p.description,
                    ownerId: admin.id,
                    direction: `Goal: Successfully deliver ${p.name} by end of Q1.`,
                    progress: Math.floor(Math.random() * 60) + 10,
                }, true);

                console.log(`✅ Project ${p.name} created`);
            }
        }

        console.log('\n🚀 Seeding completed successfully!');
        console.log('-----------------------------------');
        console.log('Login Credentials:');
        console.log('Admin: admin@company.com / admin123');
        console.log('Users: alice@company.com, bob@company.com, charlie@company.com / password123');
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    } finally {
        await app.close();
    }
}

bootstrap();
