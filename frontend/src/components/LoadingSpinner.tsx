import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`${sizeClasses[size]} text-turquoic-600 animate-spin`} />
        </div>
    );
};

export const PageLoading: React.FC = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Loading Experience...</p>
    </div>
);
