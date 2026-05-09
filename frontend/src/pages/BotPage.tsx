import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Bot as BotIcon, Send, Sparkles, ArrowLeft, 
  Trash2, CheckCircle2, ChevronRight, Zap,
  Copy, Edit3, Target, Globe, MessageSquare, Share2,
  ShieldCheck, Wand2, ArrowRight, RotateCcw, Save, X
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'bot';
  content: string;
  actions?: string[];
  executionPlan?: any[];
  timestamp: Date;
}

export const BotPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [searchParams] = useSearchParams();
  const executeId = searchParams.get('execute');
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: "Strategic Execution Protocol Initialized. I have analyzed your roadmap data and I'm ready to architect your content. How can I assist with your SEO deployment today?",
      timestamp: new Date()
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AUTO-EXECUTE FLOW
  useEffect(() => {
    if (executeId) {
      handleExecutionFlow(executeId);
    }
  }, [executeId]);

  const chatMutation = useMutation({
    mutationFn: async (msg: string) => {
      const response = await axios.post(`http://localhost:3000/api/v1/bot/${reportId}/chat`, {
        message: msg,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.message, 
        actions: data.suggested_actions,
        timestamp: new Date() 
      }]);
    }
  });

  const executeMutation = useMutation({
    mutationFn: async (recId: string) => {
      const response = await axios.post(`http://localhost:3000/api/v1/bot/${reportId}/execute/${recId}`);
      return response.data.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I have architected a targeted execution plan for this recommendation. Review the high-intent assets below and approve them for deployment.",
        executionPlan: data,
        timestamp: new Date() 
      }]);
    }
  });

  const handleExecutionFlow = (recId: string) => {
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `Architect execution plan for recommendation ID: ${recId.slice(0,8)}...`, 
      timestamp: new Date() 
    }]);
    executeMutation.mutate(recId);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setInput('');
    chatMutation.mutate(userMsg);
  };

  return (
    <PageWrapper fullHeight={true} className="flex flex-col bg-[#0f0f13]">
      <div className="flex flex-col h-full space-y-6">
        
        {/* Elite Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-5">
            <Link to={`/report/${reportId}`}>
              <motion.button whileTap={{ scale: 0.95 }} className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <ArrowLeft className="h-5 w-5 text-[#9896b4]" />
              </motion.button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase italic">Execution Assistant</h1>
              <div className="flex items-center gap-3">
                 <Badge className="bg-indigo-500/10 text-indigo-400 border-none">AI Protocol v1.0</Badge>
                 <span className="text-[10px] font-black text-[#5c5a7a] uppercase tracking-widest">Connected to Report: {reportId?.slice(0,8)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:grid grid-cols-2 gap-3 mr-4">
                <StatMini label="Assets Drafted" value={8} color="indigo" />
                <StatMini label="Approval Rate" value={100} color="emerald" suffix="%" />
             </div>
             <Button variant="outline" size="sm" onClick={() => setMessages([])} className="h-10 text-rose-500 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10">
               <Trash2 className="h-4 w-4 mr-2" /> CLEAR PROTOCOL
             </Button>
          </div>
        </div>

        {/* Ethical Compliance Banner (Mandatory 3.3) */}
        <div className="bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 relative overflow-hidden">
           <div className="absolute top-0 right-0 h-full w-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
           <div className="flex items-center gap-4 relative">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                 <p className="text-sm font-bold text-white uppercase italic leading-none mb-1">Human-in-the-Loop Protocol</p>
                 <p className="text-xs font-medium text-[#9896b4] max-w-lg leading-relaxed">
                   This system never auto-posts. Every asset is a strategic draft requiring your surgical review, edit, and explicit approval before manual deployment.
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-6 relative shrink-0">
              <CompliancePill icon={<CheckCircle2 className="h-3 w-3" />} text="Review Required" />
              <CompliancePill icon={<Edit3 className="h-3 w-3" />} text="Editable" />
              <CompliancePill icon={<Globe className="h-3 w-3" />} text="Manual Only" />
           </div>
        </div>

        {/* Chat / War Room Area */}
        <div className="flex-1 overflow-y-auto space-y-10 pr-4 custom-scrollbar pb-10">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    msg.role === 'user' ? 'bg-white/[0.03] border border-white/10 text-white' : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white'
                  }`}>
                    {msg.role === 'user' ? <Zap className="h-5 w-5" /> : <BotIcon className="h-5 w-5" />}
                  </div>
                  
                  <div className={`space-y-6 flex-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-8 rounded-3xl shadow-xl leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white border border-white/5' 
                        : 'bg-[#1a1a24] text-[#f1f0ff] border border-white/6'
                    }`}>
                      <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>

                    {/* Execution Plan Grid (3.2 & 3.5) */}
                    {msg.executionPlan && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {msg.executionPlan.map((item, j) => (
                          <ExecutionCard key={j} item={item} />
                        ))}
                      </div>
                    )}
                    
                    {msg.actions && (
                      <div className="flex flex-wrap gap-3">
                        {msg.actions.map((action, j) => (
                          <motion.button 
                            key={j} 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setInput(action); handleSend(); }}
                            className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all"
                          >
                            {action}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Input Command Area */}
        <div className="shrink-0 pt-4 border-t border-white/[0.06]">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute inset-0 bg-indigo-500/5 blur-2xl group-focus-within:bg-indigo-500/10 transition-all pointer-events-none" />
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Deploy strategic instructions..."
              className="relative w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-8 pr-24 text-sm font-medium text-white placeholder:text-[#5c5a7a] focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            <div className="absolute right-2 top-2 bottom-2">
              <Button 
                type="submit" 
                className="h-full px-8 rounded-xl shadow-lg" 
                disabled={!input.trim() || chatMutation.isPending}
                isLoading={chatMutation.isPending}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
          <div className="flex items-center justify-center gap-6 py-4">
             <span className="text-[9px] font-bold text-[#5c5a7a] uppercase tracking-[0.25em]">AI Core: Groq + Llama-3 (Strategy)</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ExecutionCard = ({ item }: { item: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const [status, setStatus] = useState(item.status || 'DRAFT');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Strategic asset copied to clipboard");
  };

  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className={`border-2 transition-all duration-300 ${
        status === 'APPROVED' ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 
        status === 'REJECTED' ? 'border-red-500/20 opacity-60' : 'border-white/5'
      }`}>
        <CardBody className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-indigo-400">
                  {getTypeIcon(item.type)}
               </div>
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">{item.type.replace('_', ' ')}</p>
                  <div className="flex items-center gap-2">
                     <Target className="h-3 w-3 text-[#5c5a7a]" />
                     <span className="text-[9px] font-bold text-[#9896b4] uppercase tracking-tighter">{item.target}</span>
                  </div>
               </div>
            </div>
            <Badge variant={status.toLowerCase() as any}>{status}</Badge>
          </div>

          <div className="relative group">
            {isEditing ? (
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-40 bg-white/[0.05] border border-indigo-500/50 rounded-2xl p-5 text-sm font-medium text-white leading-relaxed focus:outline-none focus:ring-4 focus:ring-indigo-500/10 custom-scrollbar"
              />
            ) : (
              <div className="w-full h-40 bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm font-medium text-[#9896b4] leading-relaxed italic overflow-y-auto custom-scrollbar">
                {content}
              </div>
            )}
            {!isEditing && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Badge className="bg-indigo-500/20 text-indigo-300 border-none">Ready for Audit</Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            {isEditing ? (
              <>
                <Button variant="success" size="sm" className="flex-1" onClick={() => setIsEditing(false)}>
                  <Save className="h-3.5 w-3.5 mr-2" /> SAVE AUDIT
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setContent(item.content); setIsEditing(false); }}>
                   <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : status === 'APPROVED' ? (
              <div className="w-full flex items-center gap-3">
                 <Button variant="outline" size="sm" className="flex-1 border-emerald-500/20 text-emerald-400" onClick={copyToClipboard}>
                    <Copy className="h-3.5 w-3.5 mr-2" /> COPY FOR POSTING
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => setStatus('DRAFT')}>
                    <RotateCcw className="h-3.5 w-3.5" />
                 </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-3.5 w-3.5 mr-2" /> EDIT DRAFT
                </Button>
                <Button variant="success" size="sm" className="h-10 w-10 p-0" onClick={() => { setStatus('APPROVED'); toast.success("Strategic asset approved"); }}>
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button variant="danger" size="sm" className="h-10 w-10 p-0" onClick={() => { setStatus('REJECTED'); toast.error("Draft rejected"); }}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'BLOG_POST_IDEA': return <Sparkles className="h-5 w-5" />;
    case 'SOCIAL_POST': return <Share2 className="h-5 w-5" />;
    case 'BLOG_COMMENT': return <MessageSquare className="h-5 w-5" />;
    case 'OUTREACH_EMAIL': return <Globe className="h-5 w-5" />;
    default: return <Wand2 className="h-5 w-5" />;
  }
};

const CompliancePill = ({ icon, text }: any) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner">
     <span className="text-indigo-400">{icon}</span>
     <span className="text-[9px] font-black text-[#5c5a7a] uppercase tracking-widest">{text}</span>
  </div>
);

const StatMini = ({ label, value, color, suffix = '' }: any) => {
  const colors: any = { indigo: 'text-indigo-400', emerald: 'text-emerald-400' };
  return (
    <div className="text-right">
       <p className="text-[8px] font-black text-[#5c5a7a] uppercase tracking-widest leading-none mb-1">{label}</p>
       <p className={`text-sm font-black italic leading-none ${colors[color]}`}>{value}{suffix}</p>
    </div>
  );
};
