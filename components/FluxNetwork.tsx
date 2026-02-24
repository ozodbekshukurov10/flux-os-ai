
import React, { useState, useEffect } from 'react';
import { 
  Zap, Activity, Globe, Shield, RefreshCw, 
  ArrowUp, ArrowDown, Cpu, Wifi, Radio,
  Layers, HardDrive, Database, Gauge
} from 'lucide-react';

interface FluxNetworkProps {
  isHyperActive: boolean;
  setHyperActive: (val: boolean) => void;
}

export const FluxNetwork: React.FC<FluxNetworkProps> = ({ isHyperActive, setHyperActive }) => {
  const [speed, setSpeed] = useState(42.5);
  const [optimizing, setOptimizing] = useState(false);
  const [metrics, setMetrics] = useState({
    ping: 24,
    packetLoss: 0.02,
    jitter: 4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const base = isHyperActive ? 450.0 : 42.5;
      const jitter = (Math.random() - 0.5) * (isHyperActive ? 20 : 5);
      setSpeed(base + jitter);
      
      setMetrics(prev => ({
        ping: isHyperActive ? Math.max(2, prev.ping - 0.5) : Math.min(24, prev.ping + 0.5),
        packetLoss: isHyperActive ? 0.001 : 0.02,
        jitter: isHyperActive ? 1 : 4
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isHyperActive]);

  const toggleHyperLink = () => {
    setOptimizing(true);
    setTimeout(() => {
      setHyperActive(!isHyperActive);
      setOptimizing(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-ios">
      {/* Header & Main Toggle */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <section className={`flex-1 glass-panel p-10 rounded-[40px] border transition-all duration-700 relative overflow-hidden ${isHyperActive ? 'bg-cyan-500/5 border-cyan-500/30' : 'border-white/5'}`}>
          {/* Animated Tunnel Background */}
          {isHyperActive && (
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-around overflow-hidden">
                   {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-[200%] -translate-x-1/2 animate-[tunnel_3s_linear_infinite]" style={{ animationDelay: `${i*0.5}s` }} />
                   ))}
                </div>
             </div>
          )}

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-[24px] shadow-2xl transition-all duration-500 ${isHyperActive ? 'bg-cyan-500 text-white shadow-cyan-500/30' : 'bg-white/5 text-slate-500'}`}>
                <Zap className={isHyperActive ? 'fill-current animate-pulse' : ''} size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Flux Hyper-Link</h2>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isHyperActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {isHyperActive ? 'Quantum Tunneling Enabled' : 'Standard Connection Mode'}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              Tizim barcha tarmoq so'rovlarini parallel oqimlarga ajratadi va "Neural DNS" orqali eng qisqa yo'lni aniqlaydi. Yuklanish tezligi 10 baravargacha oshadi.
            </p>

            <div className="pt-6">
               <button 
                onClick={toggleHyperLink}
                disabled={optimizing}
                className={`group relative w-full sm:w-auto px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 ${
                  isHyperActive 
                  ? 'bg-cyan-600 text-white shadow-2xl shadow-cyan-600/30' 
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                }`}
               >
                 {optimizing ? (
                   <div className="flex items-center gap-3">
                      <RefreshCw className="animate-spin" size={20} />
                      Optimallashmoqda...
                   </div>
                 ) : (
                   <div className="flex items-center gap-3">
                      {isHyperActive ? 'Turbo Rejimni O\'chirish' : 'Hyper-Linkni Yoqish'}
                   </div>
                 )}
               </button>
            </div>
          </div>
        </section>

        {/* Speed Dial */}
        <section className="w-full lg:w-96 glass-panel p-10 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
           <div className="relative">
              <svg className="w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={552}
                  strokeDashoffset={552 - (Math.min(speed, 500) / 500) * 552}
                  className={`transition-all duration-1000 ease-out ${isHyperActive ? 'text-cyan-400' : 'text-blue-500'}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-black text-white tabular-nums tracking-tighter">{speed.toFixed(1)}</span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mbps</span>
              </div>
           </div>
           <div className="flex gap-8 pt-4">
              <div className="text-center">
                 <p className="text-[9px] font-bold text-slate-600 uppercase mb-1">Ping</p>
                 <p className="text-sm font-bold text-white tabular-nums">{metrics.ping.toFixed(0)}ms</p>
              </div>
              <div className="text-center">
                 <p className="text-[9px] font-bold text-slate-600 uppercase mb-1">Jitter</p>
                 <p className="text-sm font-bold text-white tabular-nums">{metrics.jitter}ms</p>
              </div>
           </div>
        </section>
      </div>

      {/* Detail Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Neural Cache', val: '2.4 GB', icon: Database, color: 'text-indigo-400', desc: 'Pre-fetched assets' },
           { label: 'Encrypted Nodes', val: '42 Active', icon: Globe, color: 'text-emerald-400', desc: 'Frankfurt -> Tokyo' },
           { label: 'Packet Integrity', val: '99.99%', icon: Shield, color: 'text-blue-400', desc: 'Secure hash checked' },
           { label: 'Inference Load', val: '12%', icon: Cpu, color: 'text-orange-400', desc: 'Neural processing' }
         ].map((item, i) => (
           <div key={i} className="glass-panel p-6 rounded-[32px] border border-white/5 space-y-4 group hover:border-white/10 transition-all">
              <div className="flex justify-between items-start">
                 <div className={`p-3 bg-white/5 rounded-2xl ${item.color}`}><item.icon size={20} /></div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-white">{item.val}</p>
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
           </div>
         ))}
      </div>

      {/* Traffic Visualization */}
      <div className="glass-panel p-8 rounded-[40px] border border-white/5">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
               <Activity size={16} className="text-cyan-500" /> Real-time Throughput
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" /> Upload
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> Download
               </div>
            </div>
         </div>
         <div className="h-48 flex items-end gap-1 px-2">
            {[...Array(60)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-sm transition-all duration-700 ease-out ${isHyperActive ? 'bg-cyan-500/40' : 'bg-blue-500/20'}`}
                style={{ height: `${Math.random() * (isHyperActive ? 80 : 30) + 10}%` }}
              />
            ))}
         </div>
      </div>

      <style>{`
        @keyframes tunnel {
          0% { transform: translateX(-50%) skewX(45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(0%) skewX(45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
