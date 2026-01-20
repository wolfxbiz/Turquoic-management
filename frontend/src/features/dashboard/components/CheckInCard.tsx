import React, { useState } from 'react';
import { Building2, Home, Palmtree, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CheckInStatus } from '../types';

interface CheckInCardProps {
    userName: string;
    status: CheckInStatus;
    projectName?: string;
    intent?: string;
    isBlocked: boolean;
    blockReason?: string;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({
    userName,
    status,
    projectName,
    intent,
    isBlocked,
    blockReason,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusIcons = {
        in_office: <Building2 className="w-4 h-4" />,
        remote: <Home className="w-4 h-4" />,
        on_leave: <Palmtree className="w-4 h-4" />,
    };

    const statusLabels = {
        in_office: 'In Office',
        remote: 'Remote',
        on_leave: 'On Leave',
    };

    const statusColors = {
        in_office: 'text-turquoic-600 bg-turquoic-50',
        remote: 'text-brand-teal-600 bg-brand-teal-50',
        on_leave: 'text-purple-600 bg-purple-50',
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-sm border-l-4 transition-all duration-300 cursor-pointer hover:shadow-md overflow-hidden ${isBlocked ? 'border-l-orange-500' : 'border-l-turquoic-500'
                }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg border-2 border-white shadow-inner">
                            {userName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-turquoic-600 transition-colors">{userName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[status]}`}>
                                    {statusIcons[status]}
                                    {statusLabels[status]}
                                </span>
                                <span className="text-[10px] font-bold text-turquoic-600 bg-turquoic-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {projectName || 'General'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 md:mx-8">
                        <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-1'}`}>
                            {intent || 'No intent shared'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isBlocked && (
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-pulse">
                                <AlertCircle className="w-3.5 h-3.5" />
                                BLOCKED
                            </span>
                        )}
                        <div className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-5 animate-in slide-in-from-top-2 duration-300">
                        <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Today's Intent</h4>
                            <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {intent}
                            </p>
                        </div>
                        {isBlocked && (
                            <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                                <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" />
                                    Blocker Details
                                </h4>
                                <p className="text-orange-900 text-sm leading-relaxed font-medium">
                                    {blockReason}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
