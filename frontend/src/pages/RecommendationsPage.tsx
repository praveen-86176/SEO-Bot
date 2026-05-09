import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Sparkles, ChevronRight, TrendingUp,
  Zap, Code, Layers, Layout, Target, Filter, ChevronDown, 
  SearchX, CheckCircle2, BarChart3, ShieldCheck
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { reportApi } from '../api/reports';
import { motion, AnimatePresence } from 'framer-motion';

export const RecommendationsPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [filter, setFilter] = useState({ category: 'ALL', priority: 'ALL' });

  const { data: recsRes, isLoading } = useQuery({
    queryKey: ['recommendations', reportId],
    queryFn: async () => {
       const res = await fetch(`http://localhost:3000/api/v1/recommendations/${reportId}`);
       const json = await res.json();
       return json.data;
    },
    enabled: !!reportId,
  });

  const recs = Array.isArray(recsRes) ? recsRes : [];
  
  const filteredRecs = recs.filter(r => {
    if (filter.category !== 'ALL' && r.category !== filter.category) return false;
    if (filter.priority !== 'ALL' && r.priority !== filter.priority) return false;
    return true;
  });

  return (
    <PageWrapper>
      <div className="space-y-12">
        {/* Elite Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/[0.06]">
          <div className="space-y-4">
            <Link to={`/report/${reportId}`} className="inline-flex items-center text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] hover:-translate-x-1 transition-transform">
              <ArrowLeft className="h-3 w-3 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase italic leading-none">
              Strategy Roadmap
            </h1>
            <p className="text-sm font-medium text-[#5c5a7a] max-w-xl">
              15 prioritized tactical execution vectors designed to amplify your organic reach and outmaneuver market rivals.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">High Priority</p>
                <p className="text-xl font-black text-white italic leading-none">{recs.filter(r => r.priority === 'HIGH').length}</p>
             </div>
             <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Total Vectors</p>
                <p className="text-xl font-black text-white italic leading-none">{recs.length}</p>
             </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-40 bg-[#0f0f13]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-2 flex flex-wrap items-center gap-2">
           <FilterGroup 
            label="Category" 
            options={['ALL', 'TECHNICAL', 'CONTENT', 'BACKLINK', 'KEYWORD']} 
            active={filter.category} 
            onChange={(v: string) => setFilter({...filter, category: v})} 
           />
           <div className="h-6 w-px bg-white/10 mx-2" />
           <FilterGroup 
            label="Priority" 
            options={['ALL', 'HIGH', 'MEDIUM', 'LOW']} 
            active={filter.priority} 
            onChange={(v: string) => setFilter({...filter, priority: v})} 
           />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        ) : filteredRecs.length === 0 ? (
          <div className="py-20 text-center space-y-6">
             <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10 text-[#5c5a7a]">
                <SearchX className="h-8 w-8" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-bold text-white uppercase italic">No roadmap items match your filters</h3>
                <p className="text-xs font-medium text-[#5c5a7a] uppercase tracking-widest">Adjust filters or check back after re-analysis.</p>
             </div>
             <Button variant="outline" size="sm" onClick={() => setFilter({ category: 'ALL', priority: 'ALL' })}>
                Clear All Filters
             </Button>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecs.map((rec, idx) => (
                <RecommendationCard key={rec.id} rec={rec} idx={idx} reportId={reportId!} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
};

const FilterGroup = ({ label, options, active, onChange }: any) => (
  <div className="flex items-center gap-1">
    {options.map((opt: string) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
          active === opt ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-[#5c5a7a] hover:text-white'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const RecommendationCard = ({ rec, idx, reportId }: any) => {
  const categoryColors: any = {
    TECHNICAL: 'border-l-red-500',
    CONTENT: 'border-l-violet-500',
    BACKLINK: 'border-l-orange-500',
    KEYWORD: 'border-l-indigo-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Card className={`border-l-4 ${categoryColors[rec.category] || 'border-l-slate-700'} overflow-hidden group`}>
        <CardBody className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
           <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                 <Badge variant={rec.category.toLowerCase() as any}>{rec.category}</Badge>
                 <Badge variant={rec.priority.toLowerCase() as any}>{rec.priority} PRIORITY</Badge>
                 <div className="h-1 w-1 rounded-full bg-white/20 mx-1" />
                 <span className="text-[10px] font-bold text-[#5c5a7a] uppercase tracking-widest">Protocol Strategy v1.0</span>
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors uppercase italic">{rec.title}</h3>
                 <p className="text-sm text-[#9896b4] leading-relaxed max-w-2xl">{rec.description}</p>
              </div>
              
              <div className="flex items-center gap-6 pt-4 border-t border-white/[0.04]">
                 <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Impact: {rec.impact_score}%</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[10px] font-black text-[#5c5a7a] uppercase tracking-widest">Effort: {rec.effort}</span>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-4 lg:justify-end">
              <Link to={`/report/${reportId}/bot?execute=${rec.id}`} className="w-full sm:w-auto">
                 <Button className="w-full h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-indigo-400">
                    <Zap className="h-4 w-4 mr-2" />
                    GENERATE CONTENT
                 </Button>
              </Link>
              <Link to={`/report/${reportId}/bot?execute=${rec.id}`} className="w-full sm:w-auto">
                 <Button className="w-full h-14 px-8" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    EXECUTE
                 </Button>
              </Link>
           </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
