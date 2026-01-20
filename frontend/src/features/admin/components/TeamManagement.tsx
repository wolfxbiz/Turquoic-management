import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService, Team } from '../../dashboard/api/teamsService';
import { adminService } from '../api/adminService';
import { Users, Plus, LayoutGrid, List, MessageSquare, Trash2, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const TeamManagement: React.FC = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const { data: teams = [], isLoading } = useQuery({
        queryKey: ['teams'],
        queryFn: teamsService.getTeams,
    });

    const createMutation = useMutation({
        mutationFn: () => adminService.createTeam(name, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            toast.success('Team created successfully');
            closeModal();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create team');
        }
    });

    const updateMutation = useMutation({
        mutationFn: () => adminService.updateTeam(editingTeam!.id, name, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            toast.success('Team updated successfully');
            closeModal();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update team');
        }
    });

    const openCreateModal = () => {
        setEditingTeam(null);
        setName('');
        setDescription('');
        setIsCreateOpen(true);
    };

    const openEditModal = (team: Team) => {
        setEditingTeam(team);
        setName(team.name);
        setDescription(team.description || '');
        setIsCreateOpen(true);
    };

    const closeModal = () => {
        setIsCreateOpen(false);
        setEditingTeam(null);
        setName('');
        setDescription('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTeam) {
            updateMutation.mutate();
        } else {
            createMutation.mutate();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div className="bg-gray-100 p-1 rounded-2xl flex items-center">
                    <button className="px-4 py-2 bg-white text-turquoic-600 rounded-xl shadow-sm text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" />
                        Grid
                    </button>
                    <button className="px-4 py-2 text-gray-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <List className="w-4 h-4" />
                        List
                    </button>
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Construct Team</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-gray-50 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : teams.map((team: Team) => (
                    <motion.div
                        key={team.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 flex flex-col justify-between group"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="bg-turquoic-50 p-4 rounded-[1.5rem] group-hover:bg-turquoic-600 group-hover:text-white transition-all duration-300">
                                    <Users className="w-6 h-6 text-turquoic-600 group-hover:text-white" />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditModal(team)}
                                        className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-gray-800 tracking-tight">{team.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1 line-clamp-2">
                                    {team.description || 'No description provided.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-3">
                                    {team.members && team.members.length > 0 ? (
                                        team.members.slice(0, 4).map((member) => (
                                            <div
                                                key={member.id}
                                                className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                                                title={member.fullName}
                                            >
                                                {member.avatarUrl ? (
                                                    <img
                                                        src={member.avatarUrl}
                                                        alt={member.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[10px] font-black text-gray-400">
                                                        {member.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-300">
                                            0
                                        </div>
                                    )}
                                    {team.members && team.members.length > 4 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                                            +{team.members.length - 4}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {team.members ? team.members.length : 0} Active Members
                                </span>
                            </div>
                            <button className="text-[10px] font-black text-turquoic-600 uppercase tracking-widest hover:underline px-2">
                                View Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-2.5 rounded-2xl">
                                        <Plus className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-800 tracking-tight">
                                        {editingTeam ? 'Edit Team' : 'Construct Team'}
                                    </h2>
                                </div>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Team Identity</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                        placeholder="e.g. Platform Engineering"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Strategic Mission</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700 h-32 resize-none"
                                        placeholder="Describe the team's core focus and goals..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? 'Saving...'
                                        : (editingTeam ? 'Update Team' : 'Deploy Team')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
