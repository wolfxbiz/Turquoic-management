import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DailyCheckIn } from './daily-checkin.entity';

@Entity('daily_outcomes')
export class DailyOutcome {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'check_in_id' })
    checkInId: string;

    @Column({ name: 'outcome_text' })
    outcomeText: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => DailyCheckIn)
    @JoinColumn({ name: 'check_in_id' })
    checkIn: DailyCheckIn;
}
