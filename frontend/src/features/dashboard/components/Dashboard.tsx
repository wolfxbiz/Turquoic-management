import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import { PresenceSummary } from './PresenceSummary';
import { CheckInCard } from './CheckInCard';
import { BlockersPanel } from './BlockersPanel';
import { BlockerHeatmap } from './BlockerHeatmap';
import { TeamFilter } from './TeamFilter';
import { useDashboard } from '../hooks/useDashboard';


import { useQueryClient } from '@tanstack/react-query';
import { DashboardSkeleton } from './DashboardSkeleton';
import { EmptyState } from '../../../components/EmptyState';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const { data, heatmapData, isLoading, isError } = useDashboard(selectedTeamId || undefined);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
            queryClient.invalidateQueries({ queryKey: ['blocker-heatmap'] })
        ]);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    if (isLoading && !data) {
        return <DashboardSkeleton />;
    }

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto py-20">
                <EmptyState
                    title="Live connection lost"
                    description="We couldn't reach the presence server. Please check your connection."
                    action={
                        <button
                            onClick={() => handleRefresh()}
                            className="px-8 py-3 bg-turquoic-600 text-white rounded-xl font-bold"
                        >
                            Retry Connection
                        </button>
                    }
                />
            </div>
        );
    }

    const summary = data?.summary;
    const presenceList = data?.checkIns || [];
    const blockers = presenceList.filter((c) => c.isBlocked);


    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-turquoic-600 p-1.5 rounded-lg">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black text-turquoic-600 uppercase tracking-[0.3em]">Overview</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Team Presence</h1>
                    <p className="text-gray-500 mt-2 font-medium max-w-lg">
                        Real-time visibility into team status and blockers. Designed for collaboration, not surveillance.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <TeamFilter
                        selectedTeamId={selectedTeamId}
                        onSelectTeam={setSelectedTeamId}
                    />

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-3 text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 group disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isRefreshing ? 'animate-spin text-turquoic-500' : 'group-hover:rotate-180'}`} />
                        <span>{isRefreshing ? 'Syncing...' : 'Live updates'}</span>
                    </button>
                </div>
            </div>

            {isRefreshing ? (
                <DashboardSkeleton />
            ) : (

                <>
                    {/* 1. Presence Summary Stats */}
                    <PresenceSummary presence={summary || { inOffice: 0, remote: 0, onLeave: 0, blocked: 0 }} />

                    {/* 2. Blocker Heatmap (Historical Trends) */}
                    <BlockerHeatmap data={heatmapData} />

                    {/* 3. Active Blockers Panel (Current Issues) */}
                    <BlockersPanel blockers={blockers} />


                    {/* 3. Team Check-ins List */}
                    <section className="space-y-6 pt-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Today's Team Activity</h2>
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                    {presenceList.length} Total
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {presenceList.length > 0 ? (
                                presenceList.map((checkIn: any) => (
                                    <CheckInCard
                                        key={checkIn.id}
                                        userName={checkIn.userName}
                                        status={checkIn.status}
                                        projectName={checkIn.projectName}
                                        intent={checkIn.intent}
                                        isBlocked={checkIn.isBlocked}
                                        blockReason={checkIn.blockReason}
                                    />
                                ))
                            ) : (
                                <div className="py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                                    <EmptyState
                                        title="No activity yet today"
                                        description={selectedTeamId ? "No one from this team has checked in yet." : "Encourage your team to share their daily intent!"}
                                        action={
                                            <button
                                                onClick={() => navigate('/check-in')}
                                                className="px-8 py-3 bg-turquoic-600 text-white rounded-xl font-bold hover:bg-turquoic-700 transition-colors"
                                            >
                                                Be the first to check in
                                            </button>
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* Footer / Principle Badge */}
            <div className="flex justify-center pt-10">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center gap-6 max-w-2xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-2xl">
                        🛡️
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Anti-Surveillance Protocol</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            This system is built to surface blockers and foster support. No timestamps, activity tracking, or invasive metrics are recorded or displayed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
