import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
    primary: 'border-transparent bg-primary text-white hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-white hover:bg-destructive/80',
    outline: 'text-slate-950 border-slate-200',
    success: 'border-transparent bg-green-100 text-green-700 hover:bg-green-200',
    warning: 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    info: 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200',
};

function Badge({ className, variant = 'primary', ...props }) {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
                badgeVariants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
