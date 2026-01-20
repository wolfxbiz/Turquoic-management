import api from '../../../lib/api';
import { CheckInFormData, CheckInResponse, ProjectOption } from '../types';

export const checkInService = {
    getProjects: async (): Promise<ProjectOption[]> => {
        const { data } = await api.get<ProjectOption[]>('/projects');
        return data;
    },

    getTodayCheckIn: async (): Promise<CheckInResponse | null> => {
        try {
            const { data } = await api.get<CheckInResponse>('/check-ins/today');
            return data;
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            throw error;
        }
    },

    submitCheckIn: async (formData: CheckInFormData): Promise<CheckInResponse> => {
        const { data } = await api.post<CheckInResponse>('/check-ins', formData);
        return data;
    },

    checkout: async (): Promise<CheckInResponse> => {
        const { data } = await api.post<CheckInResponse>('/check-ins/checkout');
        return data;
    },
};
