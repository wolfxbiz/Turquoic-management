import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../api/projectsService';
import { CreateProjectDTO } from '../types';

export const useProjects = () => {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: ['projects'],
        queryFn: projectsService.getProjects,
    });

    const createMutation = useMutation({
        mutationFn: (projectData: CreateProjectDTO) => projectsService.createProject(projectData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateProjectDTO> }) =>
            projectsService.updateProject(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const archiveMutation = useMutation({
        mutationFn: (id: string) => projectsService.archiveProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    return {
        projects: projectsQuery.data ?? [],
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,
        createProject: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateProject: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        archiveProject: archiveMutation.mutateAsync,
        isArchiving: archiveMutation.isPending,
    };
};
