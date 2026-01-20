import React from 'react';
import { Building2, Home, Palmtree, AlertCircle } from 'lucide-react';
import { PresenceStats } from '../types';

interface PresenceSummaryProps {
    presence: PresenceStats;
}

export const PresenceSummary: React.FC<PresenceSummaryProps> = ({ presence }) => {
    const stats = [
        {
            label: 'In Office',
            value: presence.inOffice,
            icon: <Building2 className="w-6 h-6" />,
            color: 'text-turquoic-600',
            bg: 'bg-turquoic-50',
            border: 'border-turquoic-100',
        },
        {
            label: 'Remote',
            value: presence.remote,
            icon: <Home className="w-6 h-6" />,
            color: 'text-brand-teal-600',
            bg: 'bg-brand-teal-50',
            border: 'border-brand-teal-100',
        },
        {
            label: 'On Leave',
            value: presence.onLeave,
            icon: <Palmtree className="w-6 h-6" />,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100',
        },
        {
            label: 'Blocked',
            value: presence.blocked,
            icon: <AlertCircle className="w-6 h-6" />,
            color: 'text-red-600',
            bg: presence.blocked > 0 ? 'bg-red-50 ring-2 ring-red-500 ring-offset-2' : 'bg-red-50',
            border: 'border-red-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={`bg-white p-6 rounded-xl shadow-sm border ${stat.border} hover:shadow-md transition-all duration-300`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-4xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};
