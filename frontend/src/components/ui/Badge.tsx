import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'turquoic' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {

        const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

        const variants = {
            default: "bg-gray-100 text-gray-800",
            turquoic: "bg-turquoic-50 text-turquoic-700 border border-turquoic-200",
            success: "bg-green-100 text-green-800",
            warning: "bg-amber-100 text-amber-800",
            error: "bg-red-100 text-red-800",
            outline: "text-gray-900 border border-gray-200"
        };

        return (
            <span
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';
