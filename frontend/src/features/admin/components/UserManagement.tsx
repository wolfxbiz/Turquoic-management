import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../api/adminService';
import { UserPlus, Shield, User, Users, Search, MoreVertical, Trash2, UserX, Pencil } from 'lucide-react';
import { RegisterUserModal } from './RegisterUserModal';
import { EditUserModal } from './EditUserModal';
import { toast } from 'sonner';

export const UserManagement: React.FC = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: adminService.getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: adminService.deactivateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Employee access terminated');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to terminate access');
        }
    });

    const handleTerminate = (userId: string, name: string) => {
        if (window.confirm(`Are you sure you want to terminate access for ${name}? This action is permanent and they will no longer be able to log in.`)) {
            deleteMutation.mutate(userId);
        }
    };


    const filteredUsers = users.filter((u: any) =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search employees by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-turquoic-500 outline-none transition-all font-bold text-gray-700 shadow-sm"
                    />
                </div>

                <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="flex items-center gap-3 px-6 py-4 bg-turquoic-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-turquoic-100 hover:bg-turquoic-600 transition-all active:scale-95 whitespace-nowrap"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Register Employee</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Team</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-20 bg-gray-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 font-black text-lg border border-gray-200 shadow-sm overflow-hidden">
                                                    {user.avatarUrl ? (
                                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.fullName.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{user.fullName}</p>
                                                    <p className="text-xs font-medium text-gray-400">{user.email}</p>
                                                    {user.jobTitle && (
                                                        <p className="text-[10px] text-turquoic-600 font-bold uppercase tracking-wider mt-1">{user.jobTitle}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.isAdmin ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                                                    <Shield className="w-3.5 h-3.5" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-turquoic-50 text-turquoic-700 rounded-lg text-xs font-bold border border-turquoic-100">
                                                    <User className="w-3.5 h-3.5" />
                                                    Employee
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.team ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {user.team.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-300 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.isActive ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                    <span className="text-xs font-black text-red-600 uppercase tracking-wider">Outboarded</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {user.isActive && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="p-2 hover:bg-turquoic-50 rounded-xl transition-all border border-transparent hover:border-turquoic-100 text-gray-300 hover:text-turquoic-600 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                                                        title="Edit Details"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTerminate(user.id, user.fullName)}
                                                        className="p-2 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 text-gray-300 hover:text-red-600 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                                                        title="Terminate Access"
                                                    >
                                                        <UserX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>


                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold">No employees found matching your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RegisterUserModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
            />
            <EditUserModal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                user={editingUser}
            />
        </div>
    );
};
