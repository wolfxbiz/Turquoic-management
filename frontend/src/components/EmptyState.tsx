import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = <Search className="w-12 h-12 text-gray-300" />,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-100 rounded-3xl animate-in fade-in duration-700">
            <div className="bg-gray-50 p-6 rounded-full mb-6 border-4 border-white shadow-lg">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">{title}</h3>
            <p className="text-gray-400 max-w-xs mb-8 font-medium italic">{description}</p>
            {action && (
                <div className="animate-in slide-in-from-bottom-2 duration-500 delay-200">
                    {action}
                </div>
            )}
        </div>
    );
};
