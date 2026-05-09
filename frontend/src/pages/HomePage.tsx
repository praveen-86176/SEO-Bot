import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  Building2, Globe, Users, MapPin, Package, 
  Target, Search, Rocket, CheckCircle2, Sparkles,
  Search as SearchIcon, BrainCircuit, BarChart3, Bot,
  TrendingUp, Activity, Terminal
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardBody } from '../components/ui/Card';
import { TagInput } from '../components/ui/TagInput';
import { Button } from '../components/ui/Button';
import { reportApi } from '../api/reports';
import toast from 'react-hot-toast';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const HomePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    target_audience: '',
    geography: '',
    services: [] as string[],
    competitors: [] as string[],
    current_keywords: [] as string[]
  });

  const createReportMutation = useMutation<any, any, any>({
    mutationFn: (data) => reportApi.create(data),
    onSuccess: (data: any) => {
      toast.success("Intelligence Engine Engaged");
      navigate(`/analysis/${data.data.reportId}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to initialize analysis");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.website) {
      return toast.error("Organization Name and Website are required");
    }
    createReportMutation.mutate(formData);
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[80vh] py-10 lg:py-20">
        
        {/* Left Side: Neural Branding */}
        <div className="lg:col-span-7 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center space-x-3 bg-white/[0.03] border border-white/[0.08] px-5 py-2 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Neural SEO Architect v2.0</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl lg:text-[110px] font-black tracking-tighter text-white leading-[0.85] uppercase italic">
                REDEFINE <br/>
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient block mt-3">SEARCH DOMINANCE</span>
              </h1>
            </div>

            <p className="text-lg lg:text-2xl text-zinc-400 leading-relaxed max-w-2xl font-medium">
              Deploy high-fidelity AI audits to strategize, map, and dominate your niche. From neural keyword mapping to rival exploitation.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
              <MiniStat icon={<SearchIcon />} label="Deep Audit" />
              <MiniStat icon={<BrainCircuit />} label="AI Strategy" />
              <MiniStat icon={<BarChart3 />} label="Rival Intel" />
              <MiniStat icon={<Bot />} label="Execution" />
            </div>
          </motion.div>
        </div>

        {/* Right Side: Protocol Card */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="perspective-1000"
          >
            <Card className="glass-card rounded-[40px] overflow-hidden">
              <CardBody className="p-8 lg:p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Mission Brief</h2>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Initialize Analysis Protocol</p>
                  </div>
                  <Terminal className="h-6 w-6 text-indigo-500 opacity-50" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Entity Name</label>
                      <input 
                        type="text"
                        placeholder="Acme Global"
                        className="input-obsidian"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nexus URL</label>
                      <input 
                        type="text"
                        placeholder="https://nexus.io"
                        className="input-obsidian"
                        value={formData.website}
                        onChange={e => setFormData({...formData, website: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Strategy Domain</label>
                    <select 
                      className="input-obsidian appearance-none"
                      value={formData.industry}
                      onChange={e => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="" className="bg-[#09090b]">Select Sector</option>
                      <option value="SaaS" className="bg-[#09090b]">SaaS / Tech</option>
                      <option value="E-commerce" className="bg-[#09090b]">E-commerce</option>
                      <option value="Services" className="bg-[#09090b]">Professional Services</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    <TagInput 
                      label="Growth Vectors (Services)" 
                      placeholder="Press Enter to add"
                      tags={formData.services}
                      onChange={tags => setFormData({...formData, services: tags})}
                    />
                    <TagInput 
                      label="Market Rivals" 
                      placeholder="Add competitor URL"
                      tags={formData.competitors}
                      onChange={tags => setFormData({...formData, competitors: tags})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] rounded-2xl font-black italic uppercase tracking-tighter"
                    isLoading={createReportMutation.isPending}
                    rightIcon={<Rocket className="h-5 w-5" />}
                  >
                    {createReportMutation.isPending ? 'Queuing Analysis...' : 'Architect Strategy'}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

const MiniStat = ({ icon, label }: any) => (
  <div className="space-y-3 group cursor-default">
    <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{label}</p>
  </div>
);
