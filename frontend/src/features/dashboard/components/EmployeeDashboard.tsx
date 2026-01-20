import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '../../projects/api/projectsService';
import { dashboardService } from '../api/dashboardService';
import { ProjectVisibilityCard } from '../../projects/components/ProjectVisibilityCard';
import { PresenceSummaryWidget } from './PresenceSummaryWidget';
import { UserProfileModal } from './UserProfileModal';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { useAuthStore } from '../../auth';

export const EmployeeDashboard: React.FC = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuthStore();
    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsService.getProjects,
    });

    const { data: presenceData } = useQuery({
        queryKey: ['dashboard', 'presence'],
        queryFn: () => dashboardService.getDashboardData(),
        refetchInterval: 30000
    });

    const activeBlockers = presenceData?.presenceList?.filter(ci => ci.isBlocked) || [];

    // Calculate blocked project IDs by matching names since API only returns project names
    const activeProjectNames = new Set(activeBlockers.map(b => b.projectName).filter(Boolean));
    const blockedProjectIds = new Set(projects.filter(p => activeProjectNames.has(p.name)).map(p => p.id));

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Team Overview</h1>
                    <p className="text-gray-500 font-medium">
                        Who is working, on what, and what needs attention
                    </p>
                </div>

                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-turquoic-200 hover:shadow-md hover:shadow-turquoic-100/50 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-gray-400 group-hover:text-turquoic-600 transition-colors" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 leading-tight group-hover:text-turquoic-700 transition-colors">My Profile</p>
                        <p className="text-[10px] font-medium text-gray-400 leading-tight max-w-[100px] truncate">{user?.jobTitle || 'Team Member'}</p>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Presence */}
                <div className="lg:col-span-1">
                    <PresenceSummaryWidget stats={presenceData?.summary} />
                </div>

                {/* Right Column: Blockers Needing Attention */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-turquoic-50 p-2 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-turquoic-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Blockers Needing Attention</h3>
                        </div>

                        {activeBlockers.length > 0 ? (
                            <div className="grid gap-4">
                                {activeBlockers.map((blocker) => (
                                    <div key={blocker.id} className="flex items-start justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex gap-4 w-full">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm shrink-0">
                                                {blocker.userName?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="font-bold text-gray-900 text-sm">{blocker.userName || 'Unknown'}</span>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-xs font-medium text-turquoic-700 bg-turquoic-50 px-2 py-0.5 rounded-md border border-turquoic-100 truncate max-w-[150px]">
                                                        {blocker.projectName || 'Unassigned'}
                                                    </span>
                                                    {blocker.blockReasonCategory && (
                                                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                                                            {blocker.blockReasonCategory}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-1">
                                                    <span className="font-semibold text-gray-500 text-xs uppercase tracking-wide mr-1">Intent:</span>
                                                    {blocker.intent}
                                                </p>
                                                {blocker.blockReasonText && (
                                                    <p className="text-red-500 text-sm leading-relaxed bg-red-50/50 p-2 rounded-lg border border-red-100/50">
                                                        <span className="font-bold text-red-600/80 mr-1">Blocker:</span>
                                                        {blocker.blockReasonText}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Removed Time/Duration display as per requirements */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                <p className="text-gray-400 font-medium">No active blockers reported</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Projects Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    Active Projects Today
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{projects.length} running</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectsLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-40 bg-gray-50 rounded-xl animate-pulse" />
                        ))
                    ) : projects.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 h-40 bg-gray-50 rounded-xl border border-gray-100 border-dashed flex flex-col items-center justify-center">
                            <p className="text-gray-400 font-medium">No active projects running today</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <ProjectVisibilityCard
                                key={project.id}
                                project={project}
                                isBlocked={blockedProjectIds.has(project.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Footer Purpose Statement */}
            <div className="border-t border-gray-100 pt-8 mt-12 text-center">
                <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                    This system exists to surface problems early, not to monitor people.
                    <br />
                    <a href="/policy" className="text-turquoic-600 hover:text-turquoic-700 underline decoration-turquoic-200 underline-offset-2 transition-colors">
                        Read: What This System Is Not
                    </a>
                </p>
            </div>


            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </div >
    );
};
