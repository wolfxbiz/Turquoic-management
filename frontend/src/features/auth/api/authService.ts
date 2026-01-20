import api from '../../../lib/api';
import { User } from '../../../types';
import { LoginCredentials } from '../types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        const { data } = await api.post<User>('/auth/login', credentials);
        return data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    getCurrentUser: async (): Promise<User> => {
        const { data } = await api.get<User>('/auth/me');
        return data;
    },

    updateProfile: async (updates: Partial<User> & { password?: string }): Promise<User> => {
        const { data } = await api.patch<User>('/users/profile', updates);
        return data;
    },
};
