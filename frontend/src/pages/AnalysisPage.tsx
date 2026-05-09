import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Loader2, Globe, Shield, Zap, Search, 
  BarChart3, Rocket, AlertCircle, Terminal,
  CheckCircle2
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { reportApi } from '../api/reports';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

/**
 * AnalysisPage - Neural Sync Command Center
 * Fixed: Misplaced imports and progress synchronization
 */
export const AnalysisPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const { data: statusRes, error, isLoading } = useQuery({
    queryKey: ['reportStatus', reportId],
    queryFn: () => reportApi.getStatus(reportId!),
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === 'DONE' ? false : 3000;
    },
    enabled: !!reportId,
  });

  const statusData = statusRes?.data;
  const status = statusData?.status;

  useEffect(() => {
    let interval: any;

    if (status === 'DONE') {
      // Fast forward progress to 100 and then navigate
      setProgress(100);
      const timer = setTimeout(() => {
        navigate(`/report/${reportId}`);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // Smooth progress simulation based on phases
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          return prev + 1.5;
        });
      }, 200);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, reportId, navigate]);

  if (error) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-md w-full border-red-500/20 bg-red-500/5">
          <CardBody className="p-8 text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Analysis Failed</h2>
              <p className="text-sm text-zinc-500">{(error as any)?.response?.data?.message || 'The strategic audit encountered a terminal error.'}</p>
            </div>
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700" onClick={() => navigate('/')}>
              Return to Command
            </Button>
          </CardBody>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-2xl space-y-16">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-3 bg-indigo-500/5 border border-indigo-500/10 px-4 py-1.5 rounded-full mb-6"
          >
            <Terminal className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Protocol Active</span>
          </motion.div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
            {statusData?.organization?.name || 'Neural Engine'}
          </h1>
          <div className="flex items-center justify-center gap-3 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            <Globe className="h-3 w-3 opacity-50" />
            <span>{statusData?.organization?.website || 'Initializing Scan...'}</span>
          </div>
        </div>

        <div className="relative space-y-12">
          <div className="flex justify-center">
            <div className="relative h-48 w-48">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090b] rounded-full border border-white/[0.05]">
                <span className="text-5xl font-black text-white italic tracking-tighter">{Math.floor(progress)}%</span>
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1">Syncing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActivityItem icon={<Search />} text="Crawling Domain Structure" active={progress > 10} done={progress > 40} />
            <ActivityItem icon={<Zap />} text="Neural Content Audit" active={progress > 40} done={progress > 70} />
            <ActivityItem icon={<Shield />} text="Rival Intelligence Map" active={progress > 70} done={progress > 90} />
            <ActivityItem icon={<Rocket />} text="Synthesizing Strategy" active={progress > 90} done={progress === 100} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ActivityItem = ({ icon, text, active, done }: any) => (
  <div className={cn(
    "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500",
    done ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" : 
    active ? "bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]" : 
    "bg-white/[0.02] border-white/[0.04] opacity-30"
  )}>
    <div className={cn(
      "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
      done ? "text-emerald-500" : active ? "text-indigo-400" : "text-zinc-600"
    )}>
      {done ? <CheckCircle2 className="h-4 w-4" /> : React.cloneElement(icon, { size: 16 })}
    </div>
    <span className={cn(
      "text-[10px] font-black uppercase tracking-widest",
      done ? "text-emerald-500" : active ? "text-white" : "text-zinc-600"
    )}>{text}</span>
  </div>
);
