import api from '../../../lib/api';
import { User } from '../../../types';
import { CreateProjectDTO, ProjectWithOwner } from '../types';

export const projectsService = {
    getProjects: async (): Promise<ProjectWithOwner[]> => {
        const { data } = await api.get<ProjectWithOwner[]>('/projects');
        return data;
    },

    getUsers: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>('/users');
        return data;
    },

    createProject: async (projectData: CreateProjectDTO): Promise<ProjectWithOwner> => {
        const { data } = await api.post<ProjectWithOwner>('/projects', projectData);
        return data;
    },

    archiveProject: async (id: string): Promise<ProjectWithOwner> => {
        const { data } = await api.patch<ProjectWithOwner>(`/projects/${id}/archive`);
        return data;
    },

    getContributors: async (projectId: string): Promise<User[]> => {
        const { data } = await api.get<User[]>(`/projects/${projectId}/contributors`);
        return data;
    },

    getTasks: async (projectId: string): Promise<any[]> => {
        const { data } = await api.get<any[]>(`/projects/${projectId}/tasks`);
        return data;
    },

    createTask: async (projectId: string, taskData: any): Promise<any> => {
        const { data } = await api.post(`/projects/${projectId}/tasks`, taskData);
        return data;
    },

    updateTask: async (taskId: string, updates: any): Promise<any> => {
        const { data } = await api.patch(`/projects/tasks/${taskId}`, updates);
        return data;
    }
};

