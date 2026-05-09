import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <textarea
            ref={ref}
            className={cn(
              'flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm leading-relaxed',
              error ? 'border-red-500 focus:ring-red-500/20' : 'hover:border-slate-300',
              className
            )}
            {...props}
          />
          <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover:border-slate-300 transition-colors duration-200" />
        </div>
        {error && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{error}</p>}
      </div>
    );
  }
);
