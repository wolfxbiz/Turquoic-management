import React, { useState } from 'react';
import { X, Loader2, FolderPlus, User as UserIcon, AlignLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateProjectDTO } from '../types';
import { projectsService } from '../api/projectsService';
import { useQuery } from '@tanstack/react-query';

import { ProjectWithOwner } from '../types';

interface CreateProjectModalProps {
    onClose: () => void;
    onSave: (project: CreateProjectDTO) => void;
    project?: ProjectWithOwner | null;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSave, project }) => {
    const { data: users = [], isLoading: isLoadingUsers } = useQuery({
        queryKey: ['users'],
        queryFn: projectsService.getUsers,
    });

    const [name, setName] = useState(project?.name || '');
    const [description, setDescription] = useState(project?.description || '');
    const [ownerId, setOwnerId] = useState(project?.ownerId || project?.owner?.id || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !ownerId) return;

        setIsSubmitting(true);
        try {
            await onSave({
                name,
                description,
                ownerId,
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* Decorative top bar */}
                <div className="h-2 bg-gradient-to-r from-turquoic-500 via-brand-teal-500 to-turquoic-500" />

                {/* Header */}
                <div className="px-10 py-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-turquoic-600" />
                            <span className="text-[10px] font-black text-turquoic-600 uppercase tracking-widest">Administrative Action</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {project ? 'Edit Project' : 'Create Project'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Project Designation
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-turquoic-600 transition-colors">
                                    <FolderPlus className="w-5 h-5 text-gray-300" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-turquoic-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder-gray-300"
                                    placeholder="e.g. Project Phoenix"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Scope & Description
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4 pointer-events-none group-focus-within:text-turquoic-600 transition-colors">
                                    <AlignLeft className="w-5 h-5 text-gray-300" />
                                </div>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-turquoic-500 focus:bg-white rounded-2xl outline-none transition-all min-h-[140px] resize-none font-medium text-gray-700 placeholder-gray-300 leading-relaxed"
                                    placeholder="Briefly define the project's core objectives..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                Executive Owner
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-turquoic-600 transition-colors">
                                    <UserIcon className="w-5 h-5 text-gray-300" />
                                </div>
                                <select
                                    required
                                    value={ownerId}
                                    onChange={(e) => setOwnerId(e.target.value)}
                                    className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-transparent focus:border-turquoic-500 focus:bg-white rounded-2xl outline-none appearance-none cursor-pointer font-bold text-gray-900 transition-all"
                                >
                                    <option value="" disabled>Assign team lead...</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.fullName}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Refuse / Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name || !description || !ownerId}
                            className="flex-[1.5] flex items-center justify-center gap-3 px-8 py-4 bg-turquoic-600 text-white font-black rounded-2xl shadow-xl shadow-turquoic-100 hover:bg-turquoic-700 disabled:opacity-30 disabled:shadow-none transition-all uppercase tracking-widest text-[10px] active:scale-95"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {project ? 'Update Project' : 'Deploy Project'}
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
