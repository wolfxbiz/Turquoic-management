import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../api/notificationsService';

export const useNotifications = () => {
    const queryClient = useQueryClient();

    const notificationsQuery = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationsService.getMyNotifications,
        refetchInterval: 60000, // Poll every minute
    });

    const unreadCountQuery = useQuery({
        queryKey: ['notifications', 'unread'],
        queryFn: notificationsService.getUnreadCount,
        refetchInterval: 60000,
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationsService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationsService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return {
        notifications: notificationsQuery.data || [],
        isLoading: notificationsQuery.isLoading,
        unreadCount: unreadCountQuery.data?.count || 0,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
    };
};
