import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Team } from '../../teams/domain/team.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'team_id', nullable: true })
    teamId: string | null;


    @Column()
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ name: 'full_name' })
    fullName: string;

    @Column({ name: 'is_admin', default: false })
    isAdmin: boolean;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'job_title', nullable: true })
    jobTitle: string;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @ManyToOne(() => Team, (team) => team.members)
    @JoinColumn({ name: 'team_id' })
    team: Team;
}

