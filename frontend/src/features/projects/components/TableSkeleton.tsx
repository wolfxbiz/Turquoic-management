import React from 'react';

export const TableSkeleton: React.FC = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="h-16 bg-gray-50/50 border-b border-gray-100" />
        <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-8 py-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-1/4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                        <div className="h-4 bg-gray-100 rounded w-full" />
                    </div>
                    <div className="h-3 bg-gray-50 rounded w-1/3" />
                    <div className="h-3 bg-gray-50 rounded w-1/6" />
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                </div>
            ))}
        </div>
    </div>
);
