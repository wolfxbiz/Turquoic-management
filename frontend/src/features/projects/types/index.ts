import { Project, User } from '../../../types';

export interface CreateProjectDTO {
    name: string;
    description: string;
    ownerId: string;
}

export interface ProjectWithOwner extends Project {
    owner: User;
}
