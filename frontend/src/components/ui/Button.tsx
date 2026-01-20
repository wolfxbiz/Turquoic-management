import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-150 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

        const variants = {
            primary: "bg-turquoic-500 text-white shadow-sm hover:bg-turquoic-600 hover:shadow-md border border-transparent",
            secondary: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
            danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm border border-transparent",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
        };

        const sizes = {
            sm: "text-xs px-3 py-1.5 rounded-base",
            md: "text-base px-5 py-2.5 rounded-base",
            lg: "text-lg px-6 py-3 rounded-md"
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
