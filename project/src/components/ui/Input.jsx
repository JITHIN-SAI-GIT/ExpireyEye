import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Input = React.forwardRef(({ className, type, icon, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative group w-full">
            {icon && (
                <motion.div 
                    initial={false}
                    animate={{ 
                        scale: isFocused ? 1.1 : 1, 
                        color: isFocused ? '#10b981' : 'currentColor'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute left-4 top-0 bottom-0 flex items-center justify-center text-slate-400 pointer-events-none z-10"
                >
                    {icon}
                </motion.div>
            )}
            <input
                type={type}
                onFocus={(e) => { setIsFocused(true); if(props.onFocus) props.onFocus(e); }}
                onBlur={(e) => { setIsFocused(false); if(props.onBlur) props.onBlur(e); }}
                className={cn(
                    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-sm hover:border-slate-300 hover:shadow-md',
                    icon && 'pl-12',
                    error && 'border-destructive focus-visible:ring-destructive/50',
                    className
                )}
                ref={ref}
                {...props}
            />
            
            <AnimatePresence>
                {error && (
                    <motion.span 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-5 left-2 text-xs text-destructive font-medium"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
});
Input.displayName = 'Input';

export { Input };
