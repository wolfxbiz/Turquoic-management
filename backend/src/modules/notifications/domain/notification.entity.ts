import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type NotificationType = 'helper_request' | 'project_blocked' | 'missed_checkin';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'user_id' })
    userId: string; // Recipient

    @Column({ type: 'varchar' })
    type: NotificationType;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
