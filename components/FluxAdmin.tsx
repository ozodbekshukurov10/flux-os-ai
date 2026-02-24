
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Activity, Code2, Rocket, Save, 
  RefreshCw, CheckCircle2, Server, 
  Monitor, Database, ArrowUpRight, Plus, AlertTriangle
} from 'lucide-react';

export const FluxAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'code' | 'updates'>('status');
  const [isDeploying, setIsDeploying] = useState(false);
  const [configCode, setConfigCode] = useState(`{
  "system_version": "2.5.4-LTS",
  "ai_core": "gemini-3-pro-preview",
  "security": {
    "firewall": "active",
    "ddos_protection": "enterprise"
  },
  "deployment": {
    "region": "Frankfurt-DE",
    "nodes": 42
  }
}`);

  const [liveStats, setLiveStats] = useState({
    latency: 24,
    queries: 42100,
    uptime: "99.98%"
  });

  useEffect(() => {
    const jitter = setInterval(() => {
      setLiveStats(prev => ({
        latency: Math.floor(Math.random() * (28 - 21 + 1)) + 21,
        queries: prev.queries + Math.floor(Math.random() * 10),
        uptime: (99.97 + Math.random() * 0.02).toFixed(2) + "%"
      }));
    }, 2500);
    return () => clearInterval(jitter);
  }, []);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      alert("Tizim yangilanishi muvaffaqiyatli tarqatildi.");
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-win-open">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={32} /> Super Admin Control
          </h2>
          <p className="text-slate-500 text-sm font-medium">Barcha tizimlarning markaziy boshqaruv interfeysi</p>
        </div>

        <div className="flex p-1 bg-black/40 border border-white/5 rounded-2xl">
          {[
            { id: 'status', label: 'Xizmat Holati', icon: Activity },
            { id: 'code', label: 'Tizim Kodi', icon: Code2 },
            { id: 'updates', label: 'Yangilanishlar', icon: Rocket },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'status' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative overflow-hidden bg-gradient-to-br from-blue-600/5 to-transparent">
               <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                 <Monitor size={20} className="text-blue-500" /> Tizim Sog'lig'i (Live Monitor)
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: 'Uptime', val: liveStats.uptime, status: 'optimal' },
                    { label: 'Latency', val: `${liveStats.latency}ms`, status: 'optimal' },
                    { label: 'Errors', val: '0.00%', status: 'optimal' },
                    { label: 'Queries', val: (liveStats.queries / 1000).toFixed(1) + 'k', status: 'optimal' }
                  ].map((stat, i) => (
                    <div key={i}>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                       <p className="text-2xl font-bold text-white mb-1 transition-all tabular-nums">{stat.val}</p>
                       <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                          <CheckCircle2 size={10} /> {stat.status}
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-12 h-24 flex items-end gap-1.5 opacity-40">
                  {Array.from({length: 48}).map((_, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-1000" style={{height: `${Math.random() * 60 + 40}%`}} />
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                  <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <Database size={16} className="text-emerald-500" /> API Klaster Holati
                  </h4>
                  <div className="space-y-4">
                     {['Frankfurt-DE', 'Singapore-SG', 'NewYork-US'].map(node => (
                       <div key={node} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-xs font-bold text-slate-400">{node}</span>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                       </div>
                     ))}
                  </div>
               </div>
               <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-red-500/5">
                  <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" /> Xavfsizlik Faolligi
                  </h4>
                  <div className="space-y-4 text-[11px] text-slate-500">
                    <p className="flex justify-between"><span>DDoS Attack attempts:</span> <span className="text-white font-mono">1.2k</span></p>
                    <p className="flex justify-between"><span>SQL Injections blocked:</span> <span className="text-white font-mono">14</span></p>
                    <p className="flex justify-between"><span>Security Patches:</span> <span className="text-emerald-400 font-bold uppercase">All Applied</span></p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="glass-panel p-8 rounded-[32px] border border-white/5">
                <h4 className="text-sm font-bold text-white mb-4">Trafik (Real-time)</h4>
                <div className="text-center py-6">
                   <p className="text-5xl font-extrabold text-white mb-2 tracking-tighter tabular-nums">
                    {(8400 + Math.random() * 50).toFixed(0)}
                   </p>
                   <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Active Sessions</p>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                   <div className="h-full bg-blue-500 w-2/3 transition-all duration-500" />
                   <div className="h-full bg-indigo-500 w-1/3 transition-all duration-500" />
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase">
                   <span>Uzbekistan 72%</span>
                   <span>Others 28%</span>
                </div>
             </div>
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-white/5 border border-white/10 rounded-3xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <RefreshCw size={16} /> Tizimni qayta ishga tushirish
             </button>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="glass-panel rounded-[32px] border border-white/5 overflow-hidden">
           <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 ml-2">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                 </div>
                 <span className="text-[11px] font-mono text-slate-500 ml-4">flux_core_config.json</span>
              </div>
              <button 
                onClick={() => alert("O'zgarishlar saqlandi!")}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg"
              >
                 <Save size={14} /> Konfiguratsiyani saqlash
              </button>
           </div>
           <textarea 
            value={configCode}
            onChange={(e) => setConfigCode(e.target.value)}
            className="w-full h-[500px] bg-black/60 p-8 font-mono text-[13px] text-blue-400 focus:outline-none resize-none custom-scrollbar leading-relaxed"
            spellCheck={false}
           />
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-6 bg-gradient-to-tr from-blue-600/5 to-transparent">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <Rocket className="text-blue-500" size={24} /> Yangi Patch Tarqatish
              </h3>
              <p className="text-sm text-slate-500">Ushbu xabar barcha faol foydalanuvchilar ekranida real-vaqt rejimida paydo bo'ladi.</p>
              
              <div className="space-y-4 pt-4">
                 <input 
                  type="text" 
                  placeholder="Update Sarlavhasi"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                 />
                 <textarea 
                  placeholder="Foydalanuvchilarga yangiliklar haqida batafsil ma'lumot yuboring..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-blue-500/50 outline-none transition-all min-h-[160px] resize-none"
                 />
                 <button 
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                 >
                    {isDeploying ? <RefreshCw className="animate-spin" size={18} /> : <><Rocket size={18} /> Deploy to all nodes</>}
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest ml-4">Deployment Logs</h3>
              <div className="space-y-4">
                 {[
                   { v: '2.5.4', m: 'Security patches applied', d: 'Today' },
                   { v: '2.5.0', m: 'Gemini 3 Pro Engine integration', d: 'Yesterday' },
                   { v: '2.4.8', m: 'Mica design system optimization', d: '2 days ago' }
                 ].map((log, i) => (
                   <div key={i} className="glass-panel p-5 rounded-[24px] border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-mono text-[10px] font-bold text-slate-500">v{log.v}</div>
                         <div>
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{log.m}</p>
                            <p className="text-[10px] text-slate-600 font-bold uppercase">{log.d}</p>
                         </div>
                      </div>
                      <ArrowUpRight size={16} className="text-slate-800 group-hover:text-blue-500 transition-colors" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
