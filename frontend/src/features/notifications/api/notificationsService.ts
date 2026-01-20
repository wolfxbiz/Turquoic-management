import api from '../../../lib/api';

export interface Notification {
    id: string;
    type: 'helper_request' | 'project_blocked' | 'missed_checkin';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
}

export interface UnreadCountResponse {
    count: number;
}

export const notificationsService = {
    getMyNotifications: async (): Promise<Notification[]> => {
        const { data } = await api.get('/notifications');
        return data;
    },

    getUnreadCount: async (): Promise<UnreadCountResponse> => {
        const { data } = await api.get('/notifications/unread-count');
        return data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.patch(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch('/notifications/read-all');
    },
};
