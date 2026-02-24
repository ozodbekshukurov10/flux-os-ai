
import React, { useState, useEffect } from 'react';
import { 
  Shield, Globe, Lock, Power, RefreshCw, 
  ArrowUp, ArrowDown, Radio, Activity, 
  Zap, Database, MapPin, CheckCircle2, 
  AlertTriangle, Fingerprint, ShieldCheck
} from 'lucide-react';

interface Server {
  id: string;
  name: string;
  country: string;
  icon: string;
  ping: number;
  load: number;
  ip: string;
}

export const FluxVPN: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [dataStats, setDataStats] = useState({ up: 0, down: 0 });
  
  const servers: Server[] = [
    { id: '1', name: 'Frankfurt Core', country: 'Germany', icon: '🇩🇪', ping: 24, load: 42, ip: '185.124.42.10' },
    { id: '2', name: 'Silicon Valley', country: 'USA', icon: '🇺🇸', ping: 120, load: 88, ip: '104.24.12.88' },
    { id: '3', name: 'Tokyo Neural', country: 'Japan', icon: '🇯🇵', ping: 180, load: 31, ip: '45.12.55.90' },
    { id: '4', name: 'Singapore Node', country: 'Singapore', icon: '🇸🇬', ping: 95, load: 15, ip: '128.0.1.42' },
    { id: '5', name: 'London Bridge', country: 'UK', icon: '🇬🇧', ping: 45, load: 60, ip: '92.144.11.1' },
    { id: '6', name: 'Tashkent Proxy', country: 'Uzbekistan', icon: '🇺🇿', ping: 5, load: 12, ip: '213.230.12.4' },
  ];

  useEffect(() => {
    if (!selectedServer) setSelectedServer(servers[0]);
    
    const interval = setInterval(() => {
      if (isConnected) {
        setDataStats(prev => ({
          up: prev.up + Math.random() * 0.5,
          down: prev.down + Math.random() * 2.5
        }));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleToggle = () => {
    if (isConnected) {
      setIsConnected(false);
    } else {
      setConnecting(true);
      setTimeout(() => {
        setConnecting(false);
        setIsConnected(true);
      }, 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-ios pb-20 md:pb-0">
      {/* VPN Master Control */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <section className={`flex-1 glass-panel p-10 rounded-[40px] border transition-all duration-700 relative overflow-hidden ${isConnected ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/5'}`}>
          
          {/* Tunnel Animation Background */}
          {isConnected && (
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-around overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-[300%] -translate-x-1/2 animate-[pulse_3s_linear_infinite]" style={{ animationDelay: `${i*0.4}s` }} />
                ))}
              </div>
            </div>
          )}

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[40px] mx-auto flex items-center justify-center transition-all duration-700 relative group ${
                isConnected ? 'bg-emerald-600 shadow-[0_0_60px_rgba(16,185,129,0.3)]' : 'bg-slate-800 shadow-inner'
              }`}>
                {connecting ? (
                   <RefreshCw className="text-white animate-spin" size={48} />
                ) : (
                  <Shield size={48} className={`transition-all duration-500 ${isConnected ? 'text-white' : 'text-slate-600'}`} />
                )}
                {isConnected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-xl border-4 border-[#141414]">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mt-6">
                {isConnected ? 'Himoyalangan' : (connecting ? 'Ulanmoqda...' : 'Himoyalanmagan')}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                {isConnected ? `PROTOKOL: FLUX-X (AES-256-GCM)` : 'Ochiq tarmoq (Virtual Node)'}
              </p>
            </div>

            <button 
              onClick={handleToggle}
              disabled={connecting}
              className={`group relative px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 ${
                isConnected 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-emerald-600 text-white shadow-2xl shadow-emerald-600/30'
              }`}
            >
              {isConnected ? 'O\'chirish' : 'Ulanish'}
            </button>

            <div className="grid grid-cols-2 gap-8 w-full max-w-sm pt-4 border-t border-white/5">
               <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
                     <ArrowDown size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Download</span>
                  </div>
                  <p className="text-xl font-mono font-bold text-white tabular-nums">{dataStats.down.toFixed(2)} MB</p>
               </div>
               <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
                     <ArrowUp size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                  </div>
                  <p className="text-xl font-mono font-bold text-white tabular-nums">{dataStats.up.toFixed(2)} MB</p>
               </div>
            </div>
          </div>
        </section>

        {/* Selected Server Info */}
        <section className="w-full lg:w-96 flex flex-col gap-6">
           <div className="glass-panel p-8 rounded-[40px] border border-white/5 flex-1 flex flex-col">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Xavfsiz Tugun</h3>
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                 <div className="flex items-center gap-6">
                    <div className="text-4xl">{selectedServer?.icon}</div>
                    <div>
                       <h4 className="text-xl font-black text-white">{selectedServer?.name}</h4>
                       <p className="text-sm text-slate-500 font-medium">{selectedServer?.country}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <Radio size={14} className="text-blue-500" />
                          <span className="text-xs font-bold text-slate-400">Virtual IP</span>
                       </div>
                       <span className="text-xs font-mono font-bold text-white">{isConnected ? selectedServer?.ip : '---.---.---.---'}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <Activity size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-slate-400">Latency</span>
                       </div>
                       <span className="text-xs font-mono font-bold text-white tabular-nums">{selectedServer?.ping}ms</span>
                    </div>
                 </div>
              </div>
              <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center gap-3">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 <p className="text-[10px] text-slate-400 font-medium leading-tight">
                    Trafik Flux Cloud OS ichida to'liq shifrlangan va tashqi kuzatuvdan himoyalangan.
                 </p>
              </div>
           </div>
        </section>
      </div>

      {/* Server Selection Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest">Global Tugunlar (Nodes)</h3>
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <RefreshCw size={10} className="text-slate-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase">Avtomatik saralash</span>
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {servers.map((server) => (
             <button
               key={server.id}
               onClick={() => setSelectedServer(server)}
               className={`p-6 rounded-[32px] border transition-all duration-300 text-left group flex items-center gap-5 ${
                 selectedServer?.id === server.id 
                 ? 'bg-blue-600/10 border-blue-500/40 shadow-xl shadow-blue-600/5' 
                 : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
               }`}
             >
               <div className="text-3xl group-hover:scale-110 transition-transform">{server.icon}</div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <h5 className="font-bold text-white truncate">{server.name}</h5>
                     {selectedServer?.id === server.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-bold">
                     <span className="text-slate-500 uppercase">{server.country}</span>
                     <span className="text-slate-700">•</span>
                     <span className={server.load > 80 ? 'text-red-400' : 'text-emerald-500'}>{server.load}% Band</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-xs font-mono font-bold text-slate-500 tabular-nums">{server.ping}ms</p>
               </div>
             </button>
           ))}
        </div>
      </section>

      {/* Security Health Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Tunnel Integrity', val: 'Excellent', icon: Shield, color: 'text-blue-400' },
           { label: 'DNS Leak Test', val: 'Protected', icon: Fingerprint, color: 'text-indigo-400' },
           { label: 'Kill Switch', val: 'Active', icon: AlertTriangle, color: 'text-orange-400' }
         ].map((item, i) => (
           <div key={i} className="glass-panel p-6 rounded-[32px] border border-white/5 flex items-center gap-4 group hover:bg-white/5 transition-all">
              <div className={`p-3 bg-white/5 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                 <item.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.label}</p>
                 <p className="text-sm font-bold text-white">{item.val}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
