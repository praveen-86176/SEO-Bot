import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, max = 100, size = 'md', className, showLabel = false }: ProgressBarProps) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between text-[10px] font-bold text-[#9896b4] uppercase tracking-widest">
          <span>{percentage}% Complete</span>
        </div>
      )}
      <div className={cn('w-full bg-white/5 rounded-full overflow-hidden', heights[size], className)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
        />
      </div>
    </div>
  );
};
