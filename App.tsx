
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { FluxSearch } from './components/FluxSearch';
import { FluxCreate } from './components/FluxCreate';
import { FluxChat } from './components/FluxChat';
import { FluxDashboard } from './components/FluxDashboard';
import { FluxServer } from './components/FluxServer';
import { FluxBrowser } from './components/FluxBrowser';
import { FluxAdmin } from './components/FluxAdmin';
import { FluxSettings } from './components/FluxSettings';
import { FluxSecurity } from './components/FluxSecurity';
import { FluxMaps } from './components/FluxMaps';
import { FluxNetwork } from './components/FluxNetwork';
import { FluxVPN } from './components/FluxVPN';
import { FluxReminders } from './components/FluxReminders';
import { FluxDevices } from './components/FluxDevices';
import { FluxDesktopExport } from './components/FluxDesktopExport';
import { FluxEditor } from './components/FluxEditor';
import { Omnibox } from './components/Omnibox';
import { Auth } from './components/Auth';
import { X, Minus, Zap, Maximize2, Clock, ShieldCheck, Lock, Shield, Cpu } from 'lucide-react';

export type Tab = 'dashboard' | 'search' | 'create' | 'chat' | 'server' | 'browser' | 'admin' | 'settings' | 'security' | 'maps' | 'network' | 'vpn' | 'reminders' | 'devices' | 'desktop' | 'editor';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [globalQuery, setGlobalQuery] = useState('');
  const [user, setUser] = useState<{name: string, email: string, isAdmin: boolean, isSuperAdmin: boolean} | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [isHyperLinkActive, setIsHyperLinkActive] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('flux_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now()) {
          setUser(payload);
          setIsLoggedIn(true);
        } else {
          sessionStorage.removeItem('flux_token');
        }
      } catch (e) {
        console.error("Invalid token");
      }
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('flux_token');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    if (activeTab === 'admin' && user?.email !== 'ozodbek201024@gmail.com') {
      setActiveTab('dashboard');
    }
  }, [activeTab, user]);

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  const isAdmin = user?.email === 'ozodbek201024@gmail.com';

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-all duration-700 ${isLockedDown ? 'bg-red-950' : 'bg-black'}`}>
      {/* WINDOW TITLEBAR (Electron-Ready) */}
      <div className={`h-10 flex items-center justify-between px-4 border-b border-white/5 win-titlebar z-[100] shrink-0 ${isLockedDown ? 'bg-red-900/40' : 'bg-[#0f0f0f]'} select-none`}>
        <div className="flex items-center gap-3">
          <Zap size={14} className={isHyperLinkActive ? 'text-cyan-400 fill-current animate-pulse' : (isLockedDown ? 'text-red-500 fill-current' : (isAdmin ? 'text-indigo-500 fill-current' : 'text-blue-500 fill-current'))} />
          <div className="flex flex-col -space-y-0.5">
             <span className="text-[10px] font-black text-white tracking-widest uppercase truncate">
               {isLockedDown ? 'FLUX SENTINEL LOCKDOWN' : `Flux OS v3.1 Enterprise ${isHyperLinkActive ? '• HYPER-LINK ACTIVE' : ''}`}
             </span>
             <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
               Build 25H2 • {isAdmin ? 'Root Identity Active' : 'Verified Enterprise Node'}
             </span>
          </div>
        </div>
        
        <div className="flex h-full items-center">
          {isAdmin && (
            <div className="flex items-center gap-2 px-3 text-[9px] font-black uppercase text-indigo-400 border-r border-white/5 h-full animate-pulse">
              <Shield size={10} /> Admin Control
            </div>
          )}
          <div className={`flex items-center gap-2 px-4 text-[9px] font-bold uppercase border-r border-white/5 h-full hidden md:flex ${isLockedDown ? 'text-red-400' : 'text-emerald-500'}`}>
            {isLockedDown ? <Lock size={10} /> : <ShieldCheck size={10} />} 
            {isLockedDown ? 'Restricted' : 'Secured Node'}
          </div>
          
          <div className="flex items-center gap-2 px-4 text-[9px] font-bold text-slate-500 font-mono hidden sm:flex border-r border-white/5 h-full">
            <Clock size={11} />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>

          <div className="flex h-full">
            <button className="win-btn h-full px-4 hover:bg-white/5 text-slate-500 flex items-center transition-colors"><Minus size={14} /></button>
            <button className="win-btn h-full px-4 hover:bg-white/5 text-slate-500 flex items-center transition-colors"><Maximize2 size={12} /></button>
            <button onClick={handleLogout} className="win-btn win-btn-close h-full px-4 hover:bg-red-600 group transition-colors flex items-center">
               <X size={16} className="text-slate-500 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative flex-col md:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} isLockedDown={isLockedDown} />
        
        <main className={`flex-1 flex flex-col min-w-0 md:m-2 md:rounded-[2.5rem] md:border shadow-win relative overflow-hidden mica-effect animate-ios transition-all duration-700 ${isLockedDown ? 'bg-red-950/20 border-red-500/30' : 'bg-[#0c0c0c] border-white/10'}`}>
          <header className={`h-14 md:h-16 flex items-center px-4 md:px-8 gap-6 border-b bg-[#141414]/40 backdrop-blur-3xl shrink-0 transition-colors ${isLockedDown ? 'border-red-500/20' : 'border-white/5'}`}>
            <Omnibox onSearch={(q) => {
               if (isLockedDown) return;
               setGlobalQuery(q);
               if (q.includes('.') || q.startsWith('http')) setActiveTab('browser');
               else setActiveTab('search');
            }} initialValue={globalQuery} />
            
            <div className="flex items-center gap-4 ml-auto shrink-0">
               <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.name.split(' ')[0]}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{isAdmin ? 'Superuser' : 'Enterprise User'}</span>
               </div>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-[10px] md:text-xs font-bold shadow-2xl border border-white/10 transition-all ${isLockedDown ? 'bg-red-600 shadow-red-500/20' : (isAdmin ? 'bg-indigo-600 shadow-indigo-600/30' : (isHyperLinkActive ? 'bg-cyan-600 shadow-cyan-500/30' : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/30'))}`}>
                {isLockedDown ? <Lock size={16} /> : user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {activeTab === 'dashboard' && <FluxDashboard user={user} setTab={setActiveTab} />}
              {activeTab === 'search' && <FluxSearch externalQuery={globalQuery} isHyperLinkActive={isHyperLinkActive} />}
              {activeTab === 'create' && <FluxCreate />}
              {activeTab === 'chat' && <FluxChat user={user} />}
              {activeTab === 'server' && <FluxServer />}
              {activeTab === 'browser' && <FluxBrowser initialUrl={globalQuery} isHyperLinkActive={isHyperLinkActive} />}
              {activeTab === 'admin' && <FluxAdmin />}
              {activeTab === 'settings' && <FluxSettings user={user} onLogout={handleLogout} />}
              {activeTab === 'security' && <FluxSecurity isLockedDown={isLockedDown} setLockdown={setIsLockedDown} />}
              {activeTab === 'maps' && <FluxMaps />}
              {activeTab === 'network' && <FluxNetwork isHyperActive={isHyperLinkActive} setHyperActive={setIsHyperLinkActive} />}
              {activeTab === 'vpn' && <FluxVPN />}
              {activeTab === 'reminders' && <FluxReminders />}
              {activeTab === 'devices' && <FluxDevices />}
              {activeTab === 'desktop' && <FluxDesktopExport />}
              {activeTab === 'editor' && <FluxEditor />}
          </div>

          {/* APP STATUS BAR (UI POLISH) */}
          <div className="h-6 bg-black/40 border-t border-white/5 flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System: Stable</span>
                <span className="flex items-center gap-1.5"><Cpu size={10} /> Load: 12%</span>
             </div>
             <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Encryption: AES-256</span>
                <span className="text-blue-500">Flux OS Kernel 3.1</span>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
