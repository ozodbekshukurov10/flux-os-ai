
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Unlock, Eye, 
  Terminal, Activity, RefreshCw, AlertTriangle, 
  Fingerprint, Key, Zap, Shield
} from 'lucide-react';

interface SecurityLog {
  time: string;
  event: string;
  type: 'info' | 'warn' | 'threat';
}

interface FluxSecurityProps {
  isLockedDown: boolean;
  setLockdown: (val: boolean) => void;
}

export const FluxSecurity: React.FC<FluxSecurityProps> = ({ isLockedDown, setLockdown }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [threatCount, setThreatCount] = useState(0);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [codeIntegrity, setCodeIntegrity] = useState(100);
  const [neuralKey, setNeuralKey] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (event: string, type: SecurityLog['type'] = 'info') => {
    const log = {
      time: new Date().toLocaleTimeString([], { hour12: false }),
      event,
      type
    };
    setLogs(prev => [...prev.slice(-19), log]);
  };

  useEffect(() => {
    if (logs.length === 0) {
      addLog('Flux Sentinel initialized.', 'info');
      addLog('Firewall: Online (Stage 1 active).', 'info');
    }
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const handleScan = () => {
    setIsScanning(true);
    addLog('Deep system scan initiated...', 'info');
    
    setTimeout(() => {
      addLog('Scanning application layers...', 'info');
    }, 1000);

    setTimeout(() => {
      const found = Math.random() > 0.7 ? 1 : 0;
      if (found) {
        setThreatCount(prev => prev + 1);
        addLog('Threat detected: Unauthorized API call attempt.', 'threat');
        setCodeIntegrity(98);
      } else {
        addLog('Scan complete: No active threats found.', 'info');
      }
      setIsScanning(false);
    }, 3000);
  };

  const simulateAttack = () => {
    addLog('CRITICAL: STAGE 1 FIREWALL BYPASSED!', 'threat');
    addLog('ATTACKER ATTEMPTING DATA EXFILTRATION...', 'threat');
    
    setTimeout(() => {
      addLog('AUTOMATIC DEEP LOCKDOWN TRIGGERED (STAGE 2).', 'warn');
      addLog('ENCRYPTING USER DATABASE (AES-256-NEURAL)...', 'info');
      setLockdown(true);
    }, 1500);
  };

  const handleUnlock = () => {
    if (neuralKey === 'FLUX-SENTINEL-77') {
      addLog('NEURAL KEY VALIDATED. REVERSING ENCRYPTION...', 'info');
      setTimeout(() => {
        setLockdown(false);
        setNeuralKey('');
        addLog('System integrity restored. Stage 1 Firewall reset.', 'info');
      }, 2000);
    } else {
      addLog('INVALID NEURAL KEY. LOCKDOWN MAINTAINED.', 'threat');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-win-open">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Main Dashboard */}
        <div className="flex-1 space-y-6">
          <div className={`glass-panel p-8 rounded-[40px] border transition-all duration-700 ${isLockedDown ? 'border-red-500 bg-red-500/10' : 'border-white/5'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-[24px] transition-all ${isLockedDown ? 'bg-red-600 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {isLockedDown ? <Lock size={32} /> : <ShieldCheck size={32} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Flux Sentinel v3.0</h2>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isLockedDown ? 'text-red-400' : 'text-slate-500'}`}>
                    {isLockedDown ? 'DEEP NEURAL LOCKDOWN ACTIVE' : 'Advanced Proactive Protection'}
                  </p>
                </div>
              </div>
              {!isLockedDown && (
                <button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  {isScanning ? <RefreshCw className="animate-spin" size={14} /> : <Eye size={14} />} 
                  {isScanning ? 'Skanerlanmoqda...' : 'Skanerlash'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tizim Butunligi</p>
                <p className={`text-3xl font-mono font-bold ${codeIntegrity < 100 ? 'text-yellow-500' : 'text-emerald-500'}`}>{codeIntegrity}%</p>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bloklangan Xatarlar</p>
                <p className="text-3xl font-mono font-bold text-white tabular-nums">{threatCount}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Himoya Bosqichi</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-emerald-500 shadow-glow`} />
                  <span className="text-sm font-bold text-white">STAGE 1</span>
                  {isLockedDown && (
                    <>
                      <div className={`w-2 h-2 rounded-full bg-red-500 shadow-glow animate-pulse`} />
                      <span className="text-sm font-bold text-red-500">STAGE 2</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {isLockedDown ? (
              <div className="mt-8 p-8 bg-black/40 border border-red-500/30 rounded-[32px] space-y-6 animate-pulse">
                <div className="flex items-center gap-4 text-red-400">
                  <AlertTriangle size={24} />
                  <h4 className="font-bold">Deep Encryption Active</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Barcha foydalanuvchi ma'lumotlari shifrlangan. Tizimni ochish uchun 2-bosqich "Neural Key" kalitini kiriting.
                  <br/><span className="text-slate-600 italic">(Demo kalit: FLUX-SENTINEL-77)</span>
                </p>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    value={neuralKey}
                    onChange={(e) => setNeuralKey(e.target.value)}
                    placeholder="Enter Neural Key..."
                    className="flex-1 bg-black/60 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                  />
                  <button 
                    onClick={handleUnlock}
                    className="px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={simulateAttack}
                  className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-500 hover:bg-red-500/5 hover:text-red-400 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <AlertTriangle size={14} /> Xaker hujumini simulyatsiya qilish
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-[32px] border border-white/5 space-y-4">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Shield size={16} className="text-blue-500" /> Stage 1: Firewall
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase">Trafik Tahlili</span>
                  <span className="text-emerald-500">OPTIMAL</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]" />
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-[32px] border border-white/5 space-y-4">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Fingerprint size={16} className="text-indigo-500" /> Biometrik Sinxronizatsiya
              </h4>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Fingerprint size={20} /></div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  <p className="text-white font-bold uppercase">Ready</p>
                  Sizning qurilmangiz bilan bog'langan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Security Logs */}
        <div className="w-full lg:w-96 flex flex-col h-[600px] lg:h-auto">
          <div className="glass-panel flex-1 rounded-[40px] border border-white/5 overflow-hidden flex flex-col bg-black/40">
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentinel Logs</span>
              </div>
              <Activity size={12} className="text-emerald-500 animate-pulse" />
            </div>
            <div 
              ref={logRef}
              className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-3 bg-black/20"
            >
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 animate-in fade-in duration-300">
                  <span className="text-slate-700 shrink-0">[{log.time}]</span>
                  <span className={`${
                    log.type === 'threat' ? 'text-red-500' : 
                    log.type === 'warn' ? 'text-yellow-500' : 'text-slate-400'
                  }`}>
                    {log.type === 'threat' ? '!!! ' : ''}{log.event}
                  </span>
                </div>
              ))}
              <div className={`w-1 h-3 inline-block animate-pulse align-middle ml-1 ${isLockedDown ? 'bg-red-500' : 'bg-emerald-500'}`} />
            </div>
            <div className="p-4 bg-slate-900/40 border-t border-white/5">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Node: Frankfurt-DE</span>
                <span>Uptime: 142:12:04</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
