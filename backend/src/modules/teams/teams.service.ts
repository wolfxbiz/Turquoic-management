import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './domain/team.entity';
import { User } from '../iam/domain/user.entity';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private teamsRepository: Repository<Team>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(tenantId: string): Promise<Team[]> {
        return this.teamsRepository.find({
            where: { tenantId },
            relations: ['members'],
        });
    }

    async findOne(id: string, tenantId: string): Promise<Team> {
        const team = await this.teamsRepository.findOne({
            where: { id, tenantId },
            relations: ['members'],
        });
        if (!team) throw new NotFoundException('Team not found');
        return team;
    }

    async create(tenantId: string, name: string, description?: string): Promise<Team> {
        const team = this.teamsRepository.create({
            tenantId,
            name,
            description,
        });
        return this.teamsRepository.save(team);
    }

    async update(id: string, tenantId: string, updates: Partial<Team>): Promise<Team> {
        const team = await this.findOne(id, tenantId);
        Object.assign(team, updates);
        return this.teamsRepository.save(team);
    }

    async addMember(teamId: string, userId: string, tenantId: string): Promise<void> {
        const team = await this.findOne(teamId, tenantId);
        const user = await this.usersRepository.findOne({ where: { id: userId, tenantId } });
        if (!user) throw new NotFoundException('User not found');

        user.teamId = team.id;
        await this.usersRepository.save(user);
    }

    async removeMember(userId: string, tenantId: string): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: userId, tenantId } });
        if (!user) throw new NotFoundException('User not found');

        user.teamId = null;
        await this.usersRepository.save(user);
    }
}
