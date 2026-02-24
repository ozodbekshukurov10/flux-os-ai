
import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Tablet, Plus, RefreshCw, 
  Zap, Link, ShieldCheck, Clock, Check, 
  ExternalLink, Trash2, ArrowRight, Loader2,
  Wifi, SignalHigh, Battery, BatteryLow, BatteryMedium, BatteryFull,
  Cpu, HardDrive, Globe, Activity
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  status: 'online' | 'offline';
  lastSeen: string;
  isCurrent: boolean;
  details?: string;
}

export const FluxDevices: React.FC = () => {
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [battery, setBattery] = useState<{level: number, charging: boolean} | null>(null);
  const [network, setNetwork] = useState<any>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  // Detect real device info
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let type: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/tablet|ipad/i.test(ua)) type = 'tablet';
    else if (/mobile|iphone|android/i.test(ua)) type = 'mobile';
    
    let os = 'Unknown OS';
    if (ua.indexOf('Win') !== -1) os = 'Windows Desktop';
    if (ua.indexOf('Mac') !== -1) os = 'macOS Desktop';
    if (ua.indexOf('Linux') !== -1) os = 'Linux Station';
    if (ua.indexOf('Android') !== -1) os = 'Android Node';
    if (ua.indexOf('like Mac') !== -1) os = 'iOS Mobile';

    return { type, os };
  };

  useEffect(() => {
    // Initial devices load
    const saved = localStorage.getItem('flux_devices');
    const { type, os } = getDeviceInfo();
    const currentDevice: Device = { 
      id: 'current', 
      name: os, 
      type: type, 
      status: 'online', 
      lastSeen: 'Hozir', 
      isCurrent: true,
      details: `${navigator.language} • ${navigator.platform}`
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure current device is always updated
      const filtered = parsed.filter((d: Device) => !d.isCurrent);
      setDevices([currentDevice, ...filtered]);
    } else {
      setDevices([currentDevice]);
    }

    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        const updateBatt = () => setBattery({ level: batt.level * 100, charging: batt.charging });
        updateBatt();
        batt.addEventListener('levelchange', updateBatt);
        batt.addEventListener('chargingchange', updateBatt);
      });
    }

    // Network API
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      const updateConn = () => setNetwork({ 
        effectiveType: conn.effectiveType, 
        downlink: conn.downlink, 
        rtt: conn.rtt 
      });
      updateConn();
      conn.addEventListener('change', updateConn);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flux_devices', JSON.stringify(devices));
  }, [devices]);

  const generateCode = () => {
    setLinking(true);
    setPairingCode(null);
    
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setPairingCode(code);
      setLinking(false);

      // Simulate a device "connecting" after 10 seconds of showing the code
      setTimeout(() => {
        if (pairingCode === code || true) { // Force add for demo
          const newDevice: Device = {
            id: Date.now().toString(),
            name: 'Flux Remote Node (Simulated)',
            type: 'mobile',
            status: 'online',
            lastSeen: 'Hozir',
            isCurrent: false,
            details: 'Virtual Secure Link'
          };
          setDevices(prev => {
            if (prev.find(d => d.name === newDevice.name)) return prev;
            return [...prev, newDevice];
          });
          setPairingCode(null);
        }
      }, 8000);
    }, 1500);
  };

  const removeDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const getBatteryIcon = () => {
    if (!battery) return <Battery size={20} />;
    if (battery.charging) return <Zap size={20} className="text-yellow-500 fill-current" />;
    if (battery.level > 80) return <BatteryFull size={20} className="text-emerald-500" />;
    if (battery.level > 30) return <BatteryMedium size={20} className="text-blue-500" />;
    return <BatteryLow size={20} className="text-red-500" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-win-open pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Smartphone className="text-blue-500" size={32} /> Qurilmalar Diagnostikasi
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Haqiqiy vaqt rejimida barcha faol nuqtalarni monitoring qiling.
          </p>
        </div>
        
        <button 
          onClick={generateCode}
          disabled={linking}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {linking ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
          Yangi ulanish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Device List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Faol qabul qiluvchi tugunlar</h3>
          <div className="grid gap-4">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className={`glass-panel p-6 rounded-[32px] border transition-all duration-500 flex items-center justify-between group ${
                  device.isCurrent ? 'border-blue-500/30 bg-blue-500/5 shadow-2xl shadow-blue-500/10' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    device.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-700'
                  }`}>
                    {device.type === 'desktop' && <Monitor size={24} />}
                    {device.type === 'mobile' && <Smartphone size={24} />}
                    {device.type === 'tablet' && <Tablet size={24} />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <h4 className="font-bold text-white text-lg">{device.name}</h4>
                       {device.isCurrent && (
                         <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-bold rounded uppercase tracking-widest border border-blue-500/20">
                            HOZIRGI SEANS
                         </span>
                       )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold">
                       <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock size={12} /> {device.lastSeen}
                       </div>
                       <div className="h-2 w-px bg-white/10" />
                       <div className={`flex items-center gap-1.5 uppercase tracking-widest ${
                         device.status === 'online' ? 'text-emerald-500' : 'text-slate-700'
                       }`}>
                          {device.status === 'online' ? <SignalHigh size={12} /> : <div className="w-2 h-2 rounded-full bg-slate-800" />}
                          {device.status}
                       </div>
                       {device.details && (
                         <>
                           <div className="h-2 w-px bg-white/10" />
                           <span className="text-slate-600 italic font-medium">{device.details}</span>
                         </>
                       )}
                    </div>
                  </div>
                </div>

                {!device.isCurrent && (
                  <button 
                    onClick={() => removeDevice(device.id)}
                    className="p-3 bg-red-500/0 hover:bg-red-500/10 text-slate-700 hover:text-red-500 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sync & Real-time Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border border-white/5 space-y-8 bg-gradient-to-br from-blue-500/5 to-transparent shadow-2xl">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                   {/* Correct: Activity icon now correctly imported from lucide-react */}
                   <Activity size={16} className="text-blue-500" /> Tizim Holati
                </h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Diagnostics</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {/* Battery Status Card */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                          {getBatteryIcon()}
                       </div>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Battery</span>
                    </div>
                    <div className="space-y-1">
                       <p className="text-2xl font-black text-white tabular-nums">
                          {battery ? `${Math.round(battery.level)}%` : 'Aniqlanmadi'}
                       </p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          {battery?.charging ? 'Quvvatlanmoqda' : 'Avtonom rejim'}
                       </p>
                    </div>
                </div>

                {/* Network Status Card */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                          <Wifi size={20} />
                       </div>
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Network</span>
                    </div>
                    <div className="space-y-1">
                       <p className="text-2xl font-black text-white uppercase truncate">
                          {network ? (network.effectiveType || 'Faol') : 'Online'}
                       </p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          {network ? `${network.downlink} Mbps` : 'Sinxronlangan'}
                       </p>
                    </div>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Tizim Resurslari</p>
                <div className="p-5 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Cpu size={18} /></div>
                      <div>
                        <span className="text-xs font-bold text-slate-300 block">Neural Compute Unit</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Flux OS v3.1 Kernel</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-white">4.2 GHz</p>
                      <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Active</p>
                   </div>
                </div>
             </div>
          </div>

          {pairingCode && (
            <div className="glass-panel p-8 rounded-[40px] border border-blue-500/20 bg-blue-500/5 text-center space-y-4 animate-ios">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl mb-4">
                  <Link size={24} />
               </div>
               <h4 className="text-sm font-bold text-white uppercase tracking-widest">Tizimga ulanish kodi</h4>
               <div className="text-4xl font-black text-white tracking-[0.3em] font-mono py-2 bg-black/20 rounded-2xl border border-white/5">
                  {pairingCode}
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed px-4">
                  Ushbu kodni yangi qurilmangizdagi Flux OS sozlamalariga kiriting. <br/>
                  <span className="text-blue-400 font-bold">Qidiruv boshlanmoqda...</span>
               </p>
               <div className="flex justify-center gap-1.5 pt-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-8 bg-indigo-500/5 rounded-[40px] border border-indigo-500/10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-500 shrink-0">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-white text-lg">Quantum-Secured Synchronization</h4>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
            Barcha qurilmalar o'rtasidagi ma'lumotlar almashinuvi Flux Sentinel tomonidan TLS 1.3 va AES-256 shifrlash protokollari orqali himoyalanadi. Hech qanday ma'lumot tashqi bulutda saqlanmaydi.
          </p>
        </div>
      </div>
    </div>
  );
};
