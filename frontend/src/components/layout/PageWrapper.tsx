import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { cn } from '../../lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export const PageWrapper = ({ children, className, fullHeight = false }: PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden">
      {/* Living Background Protocol */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      
      {/* Animated Neural Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -40, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" 
      />

      <Navbar />
      
      <main className={cn(
        "relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 pt-24 pb-12",
        fullHeight ? "h-screen overflow-hidden" : "min-h-screen",
        className
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
