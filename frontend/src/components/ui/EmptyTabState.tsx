import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyTabStateProps {
  message: string;
  hint?: string;
  variant?: 'info' | 'error';
}

export const EmptyTabState = ({ message, hint, variant = 'info' }: EmptyTabStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 py-20 text-center glass-card rounded-[32px] border-dashed border-white/[0.05]"
    >
      <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-6 ${
        variant === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'
      }`}>
        {variant === 'error' ? <AlertCircle className="h-8 w-8" /> : <Info className="h-8 w-8" />}
      </div>
      
      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
        {message}
      </h3>
      
      {hint && (
        <p className="text-sm font-medium text-zinc-500 max-w-sm tracking-tight leading-relaxed">
          {hint}
        </p>
      )}
    </motion.div>
  );
};
