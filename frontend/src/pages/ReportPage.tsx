import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart2, Target, Users, Link2, Settings, 
  Sparkles, AlertTriangle, TrendingUp, Globe,
  ChevronRight, Search, Zap, Shield, Loader2,
  AlertCircle, Info, ExternalLink, ArrowRight,
  Target as TargetIcon,
  FileText as FileTextIcon
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { EmptyTabState } from '../components/ui/EmptyTabState';
import { reportApi } from '../api/reports';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// --- Safe-Access Helpers ---
const safeArray = (val: any): any[] => Array.isArray(val) ? val : [];
const safeStr = (val: any, fallback = 'N/A'): string => (val !== null && val !== undefined) ? String(val) : fallback;
const safeNum = (val: any, fallback = 0): number => (typeof val === 'number') ? val : fallback;

export const ReportPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: reportRes, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportApi.getById(reportId!),
    enabled: !!reportId,
    retry: 1
  });

  const report = reportRes?.data;
  const org = report?.organization;
  const analysis = report?.raw_crawl_data?.analysis;

  if (isLoading) return <ReportSkeleton />;
  
  if (isError) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md w-full border-red-500/20 bg-red-500/5">
          <CardBody className="p-10 text-center space-y-6">
            <div className="h-20 w-20 rounded-[32px] bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Strategic Failure</h2>
            <Button className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-widest" onClick={() => refetch()}>
              Neural Retry
            </Button>
          </CardBody>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <div className="flex bg-[#09090b] min-h-screen">
      <Sidebar 
        orgName={safeStr(org?.name)} 
        website={safeStr(org?.website)} 
        score={safeNum(analysis?.technical?.score)}
        grade={safeStr(analysis?.technical?.grade, 'N/A')}
      />
      
      <main className="flex-1 lg:ml-64 relative z-10">
        <PageWrapper className="pt-20 px-6 sm:px-8 pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                 <h1 className="text-5xl font-black tracking-tight text-white uppercase italic">Neural Report</h1>
                 <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-4 py-1.5 text-[10px] tracking-[0.2em] font-black uppercase">
                   {safeStr(report?.status).toUpperCase()}
                 </Badge>
              </div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                ENTITY: {safeStr(org?.name)} • {safeStr(report?.created_at).split('T')[0]}
              </p>
            </div>
            
            <Link to={`/report/${reportId}/recommendations`}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-14 px-8 rounded-2xl bg-indigo-600 text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center gap-3"
              >
                <Sparkles className="h-4 w-4" />
                Strategy Roadmap
              </motion.button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {['overview', 'keywords', 'competitors', 'backlinks', 'technical'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shrink-0 border",
                  activeTab === tab ? "bg-white/[0.05] text-white border-white/[0.1] shadow-xl" : "text-zinc-600 border-transparent hover:text-zinc-400"
                )}
              >
                {tab === 'overview' && <BarChart2 size={14} />}
                {tab === 'keywords' && <Target size={14} />}
                {tab === 'competitors' && <Users size={14} />}
                {tab === 'backlinks' && <Link2 size={14} />}
                {tab === 'technical' && <Settings size={14} />}
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab report={report} />}
            {activeTab === 'keywords' && <KeywordsTab report={report} />}
            {activeTab === 'competitors' && <CompetitorsTab report={report} />}
            {activeTab === 'backlinks' && <BacklinksTab report={report} />}
            {activeTab === 'technical' && <TechnicalTab report={report} />}
          </AnimatePresence>
        </PageWrapper>
      </main>
    </div>
  );
};

const OverviewTab = ({ report }: any) => {
  const analysis = report?.raw_crawl_data?.analysis;
  const websiteData = report?.raw_crawl_data?.crawl;
  const keywords = analysis?.keywords;
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      {websiteData?.isFallback && (
        <div className="p-6 rounded-[32px] bg-amber-500/5 border border-amber-500/20 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
          <div className="space-y-1">
             <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Neural Proxy Active</h4>
             <p className="text-xs font-bold text-amber-200/60 leading-relaxed uppercase tracking-tight">
               Intelligence synthesized via industry heuristics. Direct access restricted.
             </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Neural Health" value={safeNum(analysis?.technical?.score)} suffix="/100" icon={<Settings className="h-5 w-5" />} variant="rose" />
        <StatCard label="Semantic Depth" value={safeArray(keywords?.primary_keywords).length + safeArray(keywords?.secondary_keywords).length} icon={<TargetIcon className="h-5 w-5" />} variant="indigo" />
        <StatCard label="Market Rivals" value={safeArray(report?.competitor_analysis?.competitors || report?.competitor_analysis).length} icon={<Users className="h-5 w-5" />} variant="violet" />
        <StatCard label="Growth Points" value={safeArray(report?.recommendations).length} icon={<Sparkles className="h-5 w-5" />} variant="amber" />
      </div>

      <Card className="relative overflow-hidden border-white/[0.05] bg-white/[0.01] shadow-2xl">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
        <CardBody className="p-12 space-y-10">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Strategic Synthesis</h3>
          <p className="text-2xl text-zinc-300 leading-[1.6] font-medium italic opacity-90 border-l-2 border-white/[0.05] pl-8">
            "{safeStr(keywords?.reasoning, 'Intelligence mapping in progress...')}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-white/[0.05]">
             <MetricDisplay label="Website Status" value={safeStr(websiteData?.status, 'Live')} icon={<Globe className="h-4 w-4 text-emerald-500" />} />
             <MetricDisplay label="Page Count" value={safeNum(websiteData?.totalPages, 0)} icon={<FileTextIcon className="h-4 w-4 text-indigo-500" />} />
             <MetricDisplay label="Protocol" value={safeStr(websiteData?.protocol, 'HTTPS')} icon={<Shield className="h-4 w-4 text-violet-500" />} />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

const KeywordsTab = ({ report }: any) => {
  const kw = report?.raw_crawl_data?.analysis?.keywords;
  if (!kw || kw.error) return <EmptyTabState message="Keywords Unavailable" />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {safeArray(kw.primary_keywords).map((k: any, i: number) => (
        <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
           <span className="text-sm font-bold text-white uppercase italic">{typeof k === 'string' ? k : k.keyword}</span>
           <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-3 text-[9px] font-black uppercase tracking-widest">
             {typeof k === 'string' ? 'Informational' : k.search_intent}
           </Badge>
        </div>
      ))}
    </div>
  );
};

const CompetitorsTab = ({ report }: any) => {
  const comps = safeArray(report?.competitor_analysis?.competitors || report?.competitor_analysis);
  if (comps.length === 0) return <EmptyTabState message="Market Rivals Unknown" />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {comps.map((c: any, i: number) => (
        <Card key={i} className="bg-white/[0.01] border-white/[0.05] p-6 space-y-4">
           <h4 className="text-lg font-black text-white uppercase italic">{safeStr(c?.name)}</h4>
           <div className="flex flex-wrap gap-2">
              {safeArray(c?.strengths).map((s: any) => (
                <span key={s} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[8px] uppercase font-bold">{s}</span>
              ))}
           </div>
        </Card>
      ))}
    </div>
  );
};

const BacklinksTab = ({ report }: any) => {
  const backlinks = report?.backlink_strategy;
  if (!backlinks || backlinks.error) return <EmptyTabState message="Backlinks Mapping Locked" />;
  return (
    <div className="space-y-8">
      {safeArray(backlinks.quick_wins).map((win: any, i: number) => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
           <p className="text-xs font-bold text-zinc-300 uppercase italic tracking-tight">{safeStr(win?.description)}</p>
           <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 text-[9px] font-black uppercase">Low Complexity</Badge>
        </div>
      ))}
    </div>
  );
};

const TechnicalTab = ({ report }: any) => {
  const technical = report?.raw_crawl_data?.analysis?.technical;
  if (!technical || technical.error) return <EmptyTabState message="Technical Audit Blocked" />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(technical?.breakdown ?? {}).map(([key, val]: any) => (
        <div key={key} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{key.replace('_', ' ')}</span>
          <span className="text-sm font-black text-white italic">{safeNum(val)}%</span>
        </div>
      ))}
    </div>
  );
};

const MetricDisplay = ({ label, value, icon }: any) => (
  <div className="flex items-center gap-4">
    <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
      {icon}
    </div>
    <div className="space-y-0.5">
       <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">{label}</p>
       <p className="text-xs font-black text-white uppercase italic">{value}</p>
    </div>
  </div>
);

const QuickWinCard = ({ num, text }: any) => (
  <Card className="border-white/5 bg-white/[0.01] p-6 flex items-start gap-6">
     <span className="text-2xl font-black text-indigo-500/40 italic leading-none">{num}</span>
     <p className="text-xs font-bold text-zinc-400 leading-relaxed uppercase tracking-wide">{text}</p>
  </Card>
);

const ReportSkeleton = () => (
  <div className="flex bg-[#09090b] min-h-screen">
    <div className="w-64 border-r border-white/[0.05] p-5 space-y-10">
       <Skeleton className="h-12 w-full opacity-10" />
       {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full opacity-5" />)}
    </div>
    <div className="flex-1 p-12 space-y-12">
       <Skeleton className="h-12 w-96 opacity-10" />
       <div className="grid grid-cols-4 gap-8">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full opacity-10" />)}
       </div>
       <Skeleton className="h-96 w-full opacity-5" />
    </div>
  </div>
);
