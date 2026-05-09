import React from 'react';
import { motion, animate } from 'framer-motion';
import { Card, CardBody } from './Card';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  suffix?: string;
  variant?: 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose';
}

export const StatCard = ({ label, value, icon, trend, suffix = '', variant = 'indigo' }: StatCardProps) => {
  const iconColors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <Card className="border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden">
      <div className={cn("absolute top-0 left-0 w-full h-0.5 opacity-30", `bg-${variant}-500`)} />
      
      <CardBody className="p-8">
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-xl border', iconColors[variant])}>
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
          </div>
          {trend !== undefined && (
            <div className={cn(
              'flex items-center text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-tighter',
              trend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-8 space-y-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{label}</p>
          <div className="flex items-baseline gap-2">
            <AnimatedCounter value={value} />
            <span className="text-sm font-black text-zinc-600 uppercase italic tracking-widest">{suffix}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const AnimatedCounter = ({ value }: { value: number }) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(0, value, {
        duration: 2,
        ease: 'easeOut',
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [value]);

  return <span ref={nodeRef} className="text-5xl font-black tracking-tighter text-white italic" />;
};
