import React, { useState } from 'react';
import { X, UserPlus, Shield, Users, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../api/adminService';
import { teamsService, Team } from '../../dashboard/api/teamsService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const RegisterUserModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        isAdmin: false,
        teamId: '',
        jobTitle: '',
        avatarUrl: '',
    });

    const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: teamsService.getTeams,
    });

    const mutation = useMutation({
        mutationFn: adminService.registerUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Employee registered successfully');
            onClose();
            setFormData({ email: '', fullName: '', password: '', isAdmin: false, teamId: '', jobTitle: '', avatarUrl: '' });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to register employee');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            email: formData.email,
            fullName: formData.fullName,
            passwordHash: formData.password,
            isAdmin: formData.isAdmin,
            teamId: formData.teamId || undefined,
            jobTitle: formData.jobTitle || undefined,
            avatarUrl: formData.avatarUrl || undefined,
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
                >
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="bg-turquoic-600 p-2.5 rounded-2xl shadow-lg shadow-turquoic-200">
                                <UserPlus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Register Employee</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Access Provisioning</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Corporate Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Initial Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                    placeholder="e.g. Senior Developer"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Profile Image URL</label>
                                <input
                                    type="text"
                                    value={formData.avatarUrl}
                                    onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Assign Team</label>
                                    <select
                                        value={formData.teamId}
                                        onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700 appearance-none"
                                    >
                                        <option value="">No Team</option>
                                        {teams.map((t: Team) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Role Type</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isAdmin: !formData.isAdmin })}
                                        className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all font-bold ${formData.isAdmin ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-600'}`}
                                    >
                                        <span className="text-sm">{formData.isAdmin ? 'Admin' : 'Employee'}</span>
                                        <Shield className={`w-4 h-4 ${formData.isAdmin ? 'text-amber-500' : 'text-gray-300'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-5 bg-turquoic-600 hover:bg-turquoic-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-turquoic-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {mutation.isPending ? 'Provisioning...' : (
                                <>
                                    <span>Initialize Access</span>
                                    <UserPlus className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
