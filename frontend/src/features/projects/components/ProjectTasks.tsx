import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../api/projectsService';
import { CheckCircle2, Circle, Clock, Plus, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectTasksProps {
    projectId: string;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId }) => {
    const queryClient = useQueryClient();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => projectsService.getTasks(projectId),
    });

    const createTaskMutation = useMutation({
        mutationFn: (title: string) => projectsService.createTask(projectId, { title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setNewTaskTitle('');
            setIsAdding(false);
            toast.success('Task added');
        },
        onError: () => toast.error('Failed to add task'),
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ taskId, updates }: { taskId: string; updates: any }) =>
            projectsService.updateTask(taskId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            toast.success('Task updated');
        },
        onError: () => toast.error('Failed to update task'),
    });

    const handleToggleStatus = (task: any) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        updateTaskMutation.mutate({ taskId: task.id, updates: { status: newStatus } });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        createTaskMutation.mutate(newTaskTitle);
    };

    if (isLoading) return <div className="p-4 text-center text-gray-400 text-xs">Loading tasks...</div>;

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tasks & Milestones</h5>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-turquoic-600 hover:text-turquoic-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add Task
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                    <input
                        autoFocus
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-turquoic-500/20 focus:border-turquoic-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={createTaskMutation.isPending}
                        className="px-4 py-2 bg-turquoic-500 text-white rounded-xl text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                    >
                        Save
                    </button>
                </form>
            )}

            <div className="space-y-2">
                {tasks?.length === 0 && !isAdding && (
                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm font-medium">No tasks yet</p>
                    </div>
                )}

                {tasks?.map((task: any) => (
                    <div
                        key={task.id}
                        onClick={() => handleToggleStatus(task)}
                        className="group flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-turquoic-100 transition-colors shadow-sm cursor-pointer hover:bg-gray-50"
                    >
                        <div className={`mt-0.5 ${task.status === 'done' ? 'text-emerald-500' : 'text-gray-300'}`}>
                            {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                {task.title}
                            </p>
                        </div>
                        {task.assignee && (
                            <div className="flex items-center gap-2" title={`Assigned to ${task.assignee.fullName}`}>
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                    {task.assignee.fullName.charAt(0)}
                                </div>
                            </div>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
