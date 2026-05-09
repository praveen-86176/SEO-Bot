import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 
  | 'keyword' | 'content' | 'backlink' | 'technical' 
  | 'high' | 'medium' | 'low' 
  | 'draft' | 'approved' | 'rejected' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'info', className }: BadgeProps) => {
  const variants = {
    keyword: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
    content: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    backlink: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
    technical: 'bg-red-500/15 text-red-300 border-red-500/25',
    high: 'bg-red-500/15 text-red-300 border-red-500/20',
    medium: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    draft: 'bg-gray-500/15 text-gray-300 border-gray-500/20',
    approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-300 border-red-500/20',
    info: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
