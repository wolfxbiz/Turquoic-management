import React from 'react';

export const PresenceSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4" />
                <div className="h-2 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-8 bg-gray-50 rounded w-1/4" />
            </div>
        ))}
    </div>
);

export const CheckInSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-24 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                        <div className="h-2 bg-gray-50 rounded w-1/2" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-10">
        <PresenceSkeleton />
        <div className="h-48 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
        <div className="space-y-6 pt-4">
            <div className="h-8 bg-gray-100 rounded w-48 mb-4 animate-pulse" />
            <CheckInSkeleton />
        </div>
    </div>
);
