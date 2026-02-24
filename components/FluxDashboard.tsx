
import React, { useState, useEffect } from 'react';
import { 
  Search, Image, MessageSquare, Activity, ShieldCheck, Database, 
  Sparkles, Terminal, Users, User, Globe, TrendingUp, 
  ArrowUpRight, Monitor, Clock, BarChart3, ShieldAlert, 
  Zap, Smartphone, Link, ChevronRight, Layers, Cpu,
  CheckCircle2
} from 'lucide-react';
import { Tab } from '../App';

interface DashboardProps {
  user: any;
  setTab: (tab: Tab) => void;
}

export const FluxDashboard: React.FC<DashboardProps> = ({ user, setTab }) => {
  const [time, setTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    latency: 24,
    queries: 1248,
    load: 12,
    devices: 2
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const metricJitter = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * (32 - 18 + 1)) + 18,
        queries: prev.queries + (Math.random() > 0.5 ? 1 : -1),
        load: Math.floor(Math.random() * (16 - 8 + 1)) + 8
      }));
    }, 3000);
    return () => { clearInterval(timer); clearInterval(metricJitter); };
  }, []);

  return (
    <div className="space-y-10 animate-ios pb-24">
      
      {/* Hero Sector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 glass-panel p-10 md:p-12 rounded-[48px] border border-white/10 relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-transparent to-transparent">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex flex-wrap gap-3">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Zap size={12} className="fill-current" /> Frankfurt Cluster Active
               </div>
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                <ShieldCheck size={12} /> Node Secured
               </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Salom, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user?.name.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
                Tizim barcha qurilmalaringiz bilan muvaffaqiyatli sinxronlandi. Bugun nima ustida ishlaymiz?
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setTab('search')}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-3"
              >
                <Search size={18} /> Aqlli Qidiruv
              </button>
              <button 
                onClick={() => setTab('chat')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3"
              >
                <MessageSquare size={18} /> AI Yordamchi
              </button>
            </div>
          </div>
        </section>

        {/* Global Clock Widget */}
        <section className="lg:col-span-4 glass-panel p-10 rounded-[48px] border border-white/10 flex flex-col items-center justify-center text-center space-y-6 bg-black/40">
          <div className="p-4 bg-blue-600/10 rounded-3xl text-blue-500">
             <Clock size={40} />
          </div>
          <div className="space-y-1">
             <p className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
             </p>
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">
              {time.toLocaleDateString('uz-UZ', { weekday: 'long', month: 'short', day: 'numeric' })}
             </p>
          </div>
          <div className="w-full h-px bg-white/5" />
          <div className="flex gap-2">
             {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />)}
          </div>
        </section>
      </div>

      {/* Main Apps Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Core Modullar</h3>
           <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'search', title: 'Deep Search', icon: Search, color: 'text-blue-400', desc: 'Real-time AI qidiruv' },
            { id: 'editor', title: 'Flux IDE', icon: Cpu, color: 'text-indigo-400', desc: 'Neural kodlash' },
            { id: 'browser', title: 'Stealth Web', icon: Globe, color: 'text-orange-400', desc: 'Xavfsiz brauzer' },
            { id: 'desktop', title: 'EXE Build', icon: Monitor, color: 'text-purple-400', desc: 'Desktop export' },
          ].map((action) => (
            <button 
              key={action.id}
              onClick={() => setTab(action.id as Tab)}
              className="glass-panel p-8 rounded-[40px] border border-white/5 text-left active:scale-[0.98] transition-all group hover:bg-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 shadow-glow">
                 <action.icon size={80} />
              </div>
              <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform ${action.color}`}>
                <action.icon size={28} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black text-white">{action.title}</h4>
                 <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Real-time Diagnostics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 rounded-[32px] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform"><Activity size={20} /></div>
               <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Neural Latency</p>
                  <p className="text-sm font-bold text-white tabular-nums">{metrics.latency}ms</p>
               </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow" />
         </div>

         <div className="glass-panel p-6 rounded-[32px] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform"><Layers size={20} /></div>
               <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active Threads</p>
                  <p className="text-sm font-bold text-white">42 Nodes Online</p>
               </div>
            </div>
            <div className="flex gap-1">
               {[1,2,3].map(i => <div key={i} className="w-1.5 h-3 bg-blue-500/40 rounded-full" />)}
            </div>
         </div>

         <div className="glass-panel p-6 rounded-[32px] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
               <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Encryption</p>
                  <p className="text-sm font-bold text-white">AES-256-GCM</p>
               </div>
            </div>
            {/* Fix: CheckCircle2 icon now correctly imported from lucide-react */}
            <CheckCircle2 size={16} className="text-emerald-500" />
         </div>
      </div>
    </div>
  );
};
