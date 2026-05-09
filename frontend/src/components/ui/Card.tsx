import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className, hoverable = false, onClick }: CardProps) => {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.005, borderColor: 'rgba(99,102,241,0.3)', boxShadow: '0 0 40px rgba(99,102,241,0.05)' } : undefined}
      onClick={onClick}
      className={cn(
        'bg-[#1a1a24] rounded-2xl border border-white/6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300',
        hoverable ? 'cursor-pointer' : '',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6', className)}>{children}</div>
);
