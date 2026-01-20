import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorMessageProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = "Something went wrong",
    message = "We couldn't load the information you requested. Please try again later.",
    onRetry
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-3xl border border-red-100 animate-in zoom-in-95 duration-300">
            <div className="bg-red-100 p-4 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">{title}</h3>
            <p className="text-gray-500 max-w-md mb-8 font-medium">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100 uppercase tracking-widest text-xs"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    );
};
