import api from '../../../lib/api';
import { User } from '../../../types';

export interface RegisterUserDto {
    email: string;
    fullName: string;
    passwordHash: string;
    isAdmin: boolean;
    teamId?: string;
    jobTitle?: string;
    avatarUrl?: string;
}

export const adminService = {
    getUsers: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>('/users');
        return data;
    },

    registerUser: async (user: RegisterUserDto): Promise<User> => {
        const { data } = await api.post<User>('/users/register', user);
        return data;
    },

    assignToTeam: async (userId: string, teamId: string): Promise<void> => {
        await api.post(`/teams/${teamId}/members/${userId}`);
    },

    removeFromTeam: async (userId: string): Promise<void> => {
        await api.delete(`/teams/members/${userId}`);
    },

    createTeam: async (name: string, description?: string): Promise<any> => {
        const { data } = await api.post('/teams', { name, description });
        return data;
    },

    deactivateUser: async (userId: string): Promise<void> => {
        await api.delete(`/users/${userId}`);
    },

    updateUser: async (id: string, updates: Partial<RegisterUserDto>): Promise<User> => {
        const { data } = await api.patch<User>(`/users/${id}`, updates);
        return data;
    }
};

