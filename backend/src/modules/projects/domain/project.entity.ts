import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../iam/domain/user.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'owner_id' })
    ownerId: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'text', nullable: true })
    direction: string;

    @Column({ default: 0 })
    progress: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;


    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;
}
