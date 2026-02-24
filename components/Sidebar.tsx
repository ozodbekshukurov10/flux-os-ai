
import React from 'react';
import { 
  Search, Image, MessageSquare, Zap, Settings, 
  LayoutDashboard, Terminal, Globe, 
  ShieldAlert, ShieldCheck, Lock, Map as MapIcon,
  Activity, Shield, Bell, Smartphone, MonitorDown, Code,
  Cpu, Database
} from 'lucide-react';
import { Tab } from '../App';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  user: any;
  isLockedDown?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, isLockedDown }) => {
  const isAdmin = user?.isAdmin === true || user?.email === 'ozodbek201024@gmail.com';
  
  const navItems = [
    { id: 'dashboard' as Tab, icon: LayoutDashboard, label: 'Asosiy' },
    { id: 'search' as Tab, icon: Search, label: 'Qidiruv' },
    { id: 'editor' as Tab, icon: Code, label: 'Flux IDE' },
    { id: 'chat' as Tab, icon: MessageSquare, label: 'AI Chat' },
    { id: 'browser' as Tab, icon: Globe, label: 'Browser' },
    { id: 'desktop' as Tab, icon: MonitorDown, label: 'Desktop EXE' },
    { id: 'admin' as Tab, icon: ShieldAlert, label: 'Admin CP', adminOnly: true },
    { id: 'maps' as Tab, icon: MapIcon, label: 'Xarita' },
    { id: 'reminders' as Tab, icon: Bell, label: 'Eslatmalar' },
    { id: 'devices' as Tab, icon: Smartphone, label: 'Qurilmalar' },
    { id: 'create' as Tab, icon: Image, label: 'Dizayn' },
    { id: 'network' as Tab, icon: Activity, label: 'Tarmoq' },
    { id: 'security' as Tab, icon: ShieldCheck, label: 'Sentinel' },
    { id: 'settings' as Tab, icon: Settings, label: 'Sozlamalar' },
  ];

  // Filter items: hide adminOnly items from non-admins
  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      <aside className={`hidden md:flex w-64 h-full flex-col p-4 z-50 shrink-0 border-r border-white/5 transition-all duration-700 ${isLockedDown ? 'bg-red-950/40' : 'bg-black'}`}>
        <div className="px-4 py-8 mb-6 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isLockedDown ? 'bg-red-600' : (isAdmin ? 'bg-indigo-600 shadow-indigo-600/30' : 'bg-blue-600 shadow-blue-600/30')}`}>
            {isLockedDown ? <Lock size={20} className="text-white" /> : (isAdmin ? <Shield size={20} className="text-white" /> : <Zap className="text-white fill-current" size={20} />)}
          </div>
          <div className="flex flex-col">
            <span className={`text-[13px] font-black uppercase tracking-widest ${isLockedDown ? 'text-red-500' : 'text-white'}`}>Flux {isAdmin ? 'Admin' : 'Core'}</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{isAdmin ? 'Enterprise Control' : 'OS Environment'}</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                disabled={isLockedDown && item.id !== 'security'}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group active:scale-95 ${
                  isActive 
                    ? (isLockedDown ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white shadow-xl') 
                    : (isLockedDown && item.id !== 'security' ? 'opacity-20 cursor-not-allowed' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300')
                }`}
              >
                <Icon size={20} className={isActive ? (isLockedDown ? 'text-red-400' : (item.adminOnly ? 'text-indigo-400' : 'text-blue-400')) : 'group-hover:text-blue-400'} />
                <span className="font-bold text-[13px]">{item.label}</span>
                {isActive && <div className={`absolute right-4 w-1.5 h-1.5 rounded-full ${isLockedDown ? 'bg-red-500' : (item.adminOnly ? 'bg-indigo-500 shadow-glow' : 'bg-blue-500 shadow-glow')}`} />}
              </button>
            );
          })}
        </nav>
      </aside>

      <nav className={`md:hidden fixed bottom-4 left-4 right-4 h-20 backdrop-blur-3xl border rounded-[2rem] z-[100] flex items-center justify-around px-4 transition-all duration-500 shadow-2xl ${isLockedDown ? 'bg-red-950/90 border-red-500/20' : 'bg-[#141414]/80 border-white/10'}`}>
        {visibleItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90 ${
                isActive ? (isLockedDown ? 'text-red-400' : 'text-blue-400') : 'text-slate-500'
              }`}
            >
              <div className={`p-2.5 rounded-2xl ${isActive ? (isLockedDown ? 'bg-red-500/20' : 'bg-blue-500/20') : ''}`}>
                <Icon size={22} />
              </div>
            </button>
          )
        })}
      </nav>
    </>
  );
};
