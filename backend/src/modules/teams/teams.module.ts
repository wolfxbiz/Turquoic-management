import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './domain/team.entity';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { User } from '../iam/domain/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Team, User])],
    providers: [TeamsService],
    controllers: [TeamsController],
    exports: [TeamsService],
})
export class TeamsModule { }
