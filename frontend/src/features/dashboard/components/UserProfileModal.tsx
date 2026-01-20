import React, { useState, useEffect } from 'react';
import { X, Save, User, Key, Briefcase, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../auth/api/authService';
import { useAuthStore } from '../../auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        fullName: '',
        jobTitle: '',
        avatarUrl: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                jobTitle: user.jobTitle || '',
                avatarUrl: user.avatarUrl || '',
                password: '',
            });
        }
    }, [user, isOpen]);

    const mutation = useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: (updatedUser) => {
            setUser(updatedUser);
            toast.success('Profile updated successfully');
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updates: any = {
            fullName: formData.fullName,
            jobTitle: formData.jobTitle,
            avatarUrl: formData.avatarUrl,
        };
        if (formData.password) {
            updates.passwordHash = formData.password;
        }
        mutation.mutate(updates);
    };

    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="bg-turquoic-600 p-2.5 rounded-2xl shadow-lg shadow-turquoic-200">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Your Profile</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Edit Personal Information</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Avatar Preview */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden relative mb-3">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <User className="w-10 h-10" />
                                    </div>
                                )}
                            </div>
                            <p className="text-lg font-bold text-gray-900">{user?.fullName}</p>
                            <p className="text-sm text-turquoic-600 font-medium">{user?.jobTitle || 'Team Member'}</p>
                            {user?.team && (
                                <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-3 py-1 rounded-full">
                                    Team: <span className="font-bold">{user.team.name}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                        placeholder="e.g. Senior Product Designer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Profile Picture URL</label>
                                <div className="relative">
                                    <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="text"
                                        value={formData.avatarUrl}
                                        onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password (Optional)</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-5 bg-turquoic-600 hover:bg-turquoic-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-turquoic-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {mutation.isPending ? 'Saving Profile...' : (
                                <>
                                    <span>Update Profile</span>
                                    <Save className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
