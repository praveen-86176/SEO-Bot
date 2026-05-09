import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { 
  BarChart2, Target, Users, Link2, Settings, 
  ChevronRight, Bot, Sparkles, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = ({ orgName, website, score, grade }: { orgName?: string; website?: string; score?: number; grade?: string }) => {
  const { reportId } = useParams<{ reportId: string }>();

  const navItems = [
    { label: 'Overview', icon: BarChart2, path: `/report/${reportId}` },
    { label: 'Keywords', icon: Target, path: `/report/${reportId}/keywords` },
    { label: 'Competitors', icon: Users, path: `/report/${reportId}/competitors` },
    { label: 'Backlinks', icon: Link2, path: `/report/${reportId}/backlinks` },
    { label: 'Technical SEO', icon: Settings, path: `/report/${reportId}/technical` },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-64px)] fixed left-0 top-16 bg-[#09090b] border-r border-white/[0.05] overflow-y-auto hidden lg:flex flex-col p-5">
      <div className="mb-10 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Globe className="h-4 w-4 text-white" />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xs font-black text-white truncate uppercase tracking-tight italic">{orgName || 'Intelligence'}</h3>
            <p className="text-[10px] font-bold text-zinc-500 truncate tracking-tight uppercase">{website || 'domain.io'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/report/${reportId}`}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group overflow-hidden
              ${isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-indigo-400'} transition-colors relative z-10`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="my-8 border-t border-white/[0.05]" />

        <NavLink
          to={`/report/${reportId}/recommendations`}
          className="flex items-center justify-between px-5 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <Sparkles className="h-4 w-4 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategy Roadmap</span>
          </div>
          <ChevronRight className="h-3 w-3 opacity-30" />
        </NavLink>

        <NavLink
          to={`/report/${reportId}/bot`}
          className="flex items-center justify-between px-5 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <Bot className="h-4 w-4 group-hover:text-indigo-400 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Execution Command</span>
          </div>
          <ChevronRight className="h-3 w-3 opacity-30" />
        </NavLink>
      </nav>

      <div className="mt-auto p-6 bg-gradient-to-br from-[#121217] to-[#09090b] rounded-3xl border border-white/[0.04] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
         <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-black text-white italic tracking-tighter">{grade || 'N/A'}</span>
            <div className="space-y-0.5">
               <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">Health Grade</p>
               <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{score ? 'OPTIMIZED' : 'ANALYZING'}</p>
            </div>
         </div>
         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score || 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
         </div>
         <p className="text-[8px] font-black text-zinc-600 mt-4 uppercase tracking-[0.2em] italic">Neural Engine Sync Active</p>
      </div>
    </aside>
  );
};
