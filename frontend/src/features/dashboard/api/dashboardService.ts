import api from '../../../lib/api';
import { DashboardData } from '../types';

export const dashboardService = {
    getDashboardData: async (teamId?: string): Promise<DashboardData> => {
        const { data } = await api.get<DashboardData>('/dashboard/presence', {
            params: { teamId }
        });
        return data;
    },

    getBlockerHeatmap: async (): Promise<{ date: string; count: number }[]> => {
        const { data } = await api.get('/check-ins/blocker-heatmap');
        return data;
    },

    getPresenceSummary: async (): Promise<{ office: number; remote: number }> => {
        const { data } = await api.get('/check-ins/summary');
        return data;
    }
};


