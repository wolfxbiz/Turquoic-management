import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../iam/domain/user.entity';
import { Project } from '../../projects/domain/project.entity';

@Entity('daily_check_ins')
@Unique(['userId', 'date'])
export class DailyCheckIn {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'project_id', nullable: true })
    projectId: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    date: string;

    @Column()
    status: string;

    @Column({ default: 'office' })
    location: string;

    @Column({ length: 120 })

    intent: string;

    @Column({ name: 'is_blocked', default: false })
    isBlocked: boolean;

    @Column({ name: 'block_reason', nullable: true })
    blockReason: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'checked_in_at', type: 'timestamptz', nullable: true })
    checkedInAt: Date;

    @Column({ name: 'checked_out_at', type: 'timestamptz', nullable: true })
    checkedOutAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Project, { nullable: true })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
