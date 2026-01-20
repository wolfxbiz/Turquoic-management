import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkInService } from '../api/checkInService';
import { CheckInFormData } from '../types';

export const useCheckIn = () => {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: ['check-in-projects'],
        queryFn: checkInService.getProjects,
    });

    const todayCheckInQuery = useQuery({
        queryKey: ['today-check-in'],
        queryFn: checkInService.getTodayCheckIn,
    });

    const submitMutation = useMutation({
        mutationFn: (formData: CheckInFormData) => checkInService.submitCheckIn(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['today-check-in'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    const checkoutMutation = useMutation({
        mutationFn: () => checkInService.checkout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['today-check-in'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });

    return {
        projects: projectsQuery.data ?? [],
        isLoadingProjects: projectsQuery.isLoading,
        todayCheckIn: todayCheckInQuery.data,
        isLoadingTodayCheckIn: todayCheckInQuery.isLoading,
        submitCheckIn: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending,
        checkout: checkoutMutation.mutateAsync,
        isCheckingOut: checkoutMutation.isPending,
    };
};
