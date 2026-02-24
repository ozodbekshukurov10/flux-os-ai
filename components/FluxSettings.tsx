
import React, { useState } from 'react';
import { 
  User, Settings as SettingsIcon, Globe, Book, 
  Info, ShieldCheck, Clock, Languages, 
  LogOut, ChevronRight, Monitor,
  Cpu, Zap, Sparkles, HelpCircle, MessageSquare
} from 'lucide-react';

interface FluxSettingsProps {
  user: any;
  onLogout: () => void;
}

type SettingSection = 'account' | 'general' | 'guide' | 'about';

export const FluxSettings: React.FC<FluxSettingsProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState<SettingSection>('account');
  const [language, setLanguage] = useState('uz');
  const [timezone, setTimezone] = useState('Asia/Tashkent');

  const menuItems = [
    { id: 'account', label: 'Profil', icon: User },
    { id: 'general', label: 'Umumiy', icon: SettingsIcon },
    { id: 'guide', label: 'Yo\'riqnoma', icon: Book },
    { id: 'about', label: 'Haqida', icon: Info },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 animate-win-open">
      {/* Settings Navigation - Horizontal scroll on mobile */}
      <aside className="w-full lg:w-72 shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 px-2">Sozlamalar</h2>
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 custom-scrollbar scroll-smooth snap-x">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingSection)}
              className={`flex items-center gap-3 px-4 md:px-5 py-3 md:py-4 rounded-2xl transition-all text-xs md:text-sm font-bold shrink-0 snap-start ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'bg-white/5 lg:bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon size={18} />
              <span className="whitespace-nowrap">{item.label}</span>
              {activeSection === item.id && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Settings Content Area */}
      <main className="flex-1 glass-panel p-6 md:p-12 rounded-3xl md:rounded-[40px] border border-white/5 min-h-[400px]">
        {activeSection === 'account' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-bold text-white capitalize">{user?.name}</h3>
                <p className="text-slate-500 text-xs md:text-sm font-medium">{user?.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                   <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded uppercase tracking-widest border border-blue-500/20">
                     {user?.isSuperAdmin ? 'Super Admin' : 'Standard Node'}
                   </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2">Xavfsizlik</h4>
              <button 
                onClick={onLogout}
                className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-center justify-between text-red-400"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} />
                  <span className="text-xs md:text-sm font-bold">Tizimdan chiqish</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {activeSection === 'general' && (
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-lg md:text-2xl font-bold text-white">Tizimni sozlash</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Til</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 md:p-4 text-xs md:text-sm text-white outline-none">
                  <option value="uz">O'zbekcha</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                <Info size={16} className="text-blue-400 mt-1" />
                <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">
                  Flux OS barcha Android va Windows qurilmalari bilan sinxronlashadi.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'guide' && (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-lg md:text-2xl font-bold text-white">Yo'riqnoma</h3>
            <div className="grid gap-4">
              {[
                { title: 'AI Qidiruv', desc: 'Eng so\'nggi ma\'lumotlarni internetdan qidiradi.', icon: Globe },
                { title: 'Flux Create', desc: 'Matnni tasvirga aylantirish vositasi.', icon: Sparkles },
                { title: 'AI Chat', desc: 'Murakkab masalalar yechimi uchun yordamchi.', icon: MessageSquare },
              ].map((step, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-3">
                    <step.icon size={18} className="text-blue-400" />
                    <h5 className="font-bold text-white text-xs md:text-sm">{step.title}</h5>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
            <Zap size={40} className="text-blue-500 fill-current" />
            <div>
              <h3 className="text-xl md:text-3xl font-extrabold text-white">Flux OS Enterprise</h3>
              <p className="text-blue-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Multi-Platform Node</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
                 <p className="text-[8px] font-bold text-slate-600 uppercase mb-1">Versiya</p>
                 <p className="text-sm md:text-lg font-bold text-white">3.0.42</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
                 <p className="text-[8px] font-bold text-slate-600 uppercase mb-1">Status</p>
                 <p className="text-sm md:text-lg font-bold text-emerald-500 uppercase">Stable</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
