import React from 'react';
import { Home, Building2, UserMinus } from 'lucide-react';
import { PresenceStats } from '../types';

interface Props {
    stats?: PresenceStats;
}

export const PresenceSummaryWidget: React.FC<Props> = ({ stats }) => {
    const displayStats = stats || { inOffice: 0, remote: 0, onLeave: 0, blocked: 0 };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6 font-sans">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Team Presence Today</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-turquoic-50 rounded-xl border border-turquoic-100">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-turquoic-600" />
                        <span className="text-sm font-medium text-turquoic-900">In Office</span>
                    </div>
                    <span className="text-2xl font-bold text-turquoic-700">{displayStats.inOffice}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Remote</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{displayStats.remote}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-75">
                    <div className="flex items-center gap-3">
                        <UserMinus className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">On Leave</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-600">{displayStats.onLeave}</span>
                </div>
            </div>
        </div>
    );
};
