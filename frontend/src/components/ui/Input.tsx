import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-[#9896b4] uppercase tracking-wide ml-0.5">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c5a7a] group-focus-within:text-indigo-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-[#5c5a7a] transition-all focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50',
              icon ? 'pl-11' : '',
              error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : '',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-1 ml-0.5 flex items-center gap-1"> {error}</p>}
      </div>
    );
  }
);
