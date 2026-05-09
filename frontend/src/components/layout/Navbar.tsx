import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, FileText, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Apex Elite Navbar - High-Fidelity Navigation Protocol
 * Resolved: ReferenceError: FileText is not defined
 */
export const Navbar = () => {
  const location = useLocation();
  const isReportPage = location.pathname.includes('/report/');

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#09090b]/60 backdrop-blur-3xl border-b border-white/[0.05] z-50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-full flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 rounded-lg p-1.5 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-baseline space-x-1 text-white uppercase italic font-black text-xl tracking-tighter">
              <span>SEO</span>
              <span className="text-indigo-400">BOT</span>
            </div>
          </Link>

          {isReportPage && (
             <div className="hidden md:flex items-center space-x-3 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="h-1 w-1 rounded-full bg-white/10" />
                <span>Strategic Protocol</span>
                <ChevronRight className="h-3 w-3 opacity-30" />
                <span className="text-indigo-400">Audit Active</span>
             </div>
          )}
        </div>

        <div className="flex items-center space-x-8">
          <a 
            href="http://localhost:3000/api/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            <FileText className="h-3.5 w-3.5 opacity-50" />
            <span>API DOCS</span>
          </a>
          
          <div className="flex items-center space-x-3 bg-white/[0.03] border border-white/[0.05] px-4 py-2 rounded-full">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">System Active</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
