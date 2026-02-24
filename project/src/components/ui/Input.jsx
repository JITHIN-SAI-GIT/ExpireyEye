import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, icon, error, ...props }, ref) => {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center text-slate-400 pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                type={type}
                className={cn(
                    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm',
                    icon && 'pl-10',
                    error && 'border-destructive focus-visible:ring-destructive/50',
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <span className="text-xs text-destructive mt-1 ml-1">{error}</span>
            )}
        </div>
    );
});
Input.displayName = 'Input';

export { Input };
