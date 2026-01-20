import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboardService';

export const useDashboard = (teamId?: string) => {
    const dashboardQuery = useQuery({
        queryKey: ['dashboard', teamId],
        queryFn: () => dashboardService.getDashboardData(teamId),
        refetchInterval: 30000,
    });

    const heatmapQuery = useQuery({
        queryKey: ['blocker-heatmap'],
        queryFn: dashboardService.getBlockerHeatmap,
        refetchInterval: 60000,
    });

    return {
        data: dashboardQuery.data,
        heatmapData: heatmapQuery.data || [],
        isLoading: dashboardQuery.isLoading || heatmapQuery.isLoading,
        isError: dashboardQuery.isError || heatmapQuery.isError,
        error: dashboardQuery.error || heatmapQuery.error,
    };
};


