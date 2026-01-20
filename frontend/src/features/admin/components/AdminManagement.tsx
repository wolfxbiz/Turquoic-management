import React, { useState } from 'react';
import { UserManagement } from './UserManagement';
import { TeamManagement } from './TeamManagement';
import { Shield, Users, UserCog, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'employees' | 'teams'>('employees');
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="bg-amber-100 p-1.5 rounded-lg border border-amber-200">
                                <Shield className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Administrator Terminal</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">System Control</h1>
                    <p className="text-gray-500 font-medium max-w-lg">
                        Manage organizational structure, employee access, and team distributions.
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] border border-gray-200 shadow-inner">
                    <button
                        onClick={() => setActiveTab('employees')}
                        className={`px-8 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'employees'
                            ? 'bg-white text-turquoic-600 shadow-lg shadow-gray-200 ring-1 ring-gray-100'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <UserCog className="w-4 h-4" />
                        Employees
                    </button>
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={`px-8 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'teams'
                            ? 'bg-white text-turquoic-600 shadow-lg shadow-gray-200 ring-1 ring-gray-100'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Teams
                    </button>
                </div>
            </div>

            <div className="min-h-[60vh]">
                {activeTab === 'employees' ? <UserManagement /> : <TeamManagement />}
            </div>

            {/* Admin Footer Information */}
            <div className="pt-12 border-t border-gray-100">
                <div className="bg-gray-50 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                            <Settings className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-800 uppercase tracking-widest text-[10px] mb-1">Audit Protocol Enabled</h4>
                            <p className="text-gray-500 text-sm font-medium">All administrative actions are logged and associated with your system ID.</p>
                        </div>
                    </div>
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                        View Audit Logs
                    </button>
                </div>
            </div>
        </div>
    );
};
