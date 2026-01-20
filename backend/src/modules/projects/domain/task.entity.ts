import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../iam/domain/user.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @Column({ name: 'assignee_id', nullable: true })
    assigneeId: string | null;

    @Column({ name: 'assigner_id' })
    assignerId: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 'todo' })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assignee_id' })
    assignee: User | null;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assigner_id' })
    assigner: User;
}
