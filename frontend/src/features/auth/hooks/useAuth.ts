import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { useAuthStore } from '../authStore';
import { LoginCredentials } from '../types';
import { useEffect } from 'react';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setUser, logout: clearStore } = useAuthStore();

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['auth-user'],
        queryFn: authService.getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    useEffect(() => {
        if (user) {
            setUser(user);
        } else if (isError) {
            setUser(null);
        }
    }, [user, isError, setUser]);

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
        onSuccess: (userData) => {
            setUser(userData);
            queryClient.setQueryData(['auth-user'], userData);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            clearStore();
            queryClient.clear();
            window.location.href = '/login';
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isPending,
    };
};
