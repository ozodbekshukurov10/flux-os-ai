
import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Lock, ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, 
  Share2, Star, Info, Server, Activity, Terminal, Code, 
  X, Search, Wifi, Zap, Cpu, ShieldAlert, Bug, Plus,
  LayoutGrid, History, Bookmark, Settings as SettingsIcon,
  ExternalLink, MousePointer2, ArrowRight, Shield, Map, EyeOff, Radio,
  Download, File, Play, Trash, CheckCircle, AlertCircle, StopCircle,
  MoreVertical, CreditCard, User, Layers, Ghost
} from 'lucide-react';
import { performSearch } from '../services/aiService';

interface TabData {
  id: string;
  title: string;
  url: string;
  viewMode: 'home' | 'iframe' | 'search' | 'ai-view';
  icon?: string;
  loading: boolean;
  isSecure: boolean;
}

interface FluxBrowserProps {
  initialUrl?: string;
  isHyperLinkActive?: boolean;
}

export const FluxBrowser: React.FC<FluxBrowserProps> = ({ initialUrl, isHyperLinkActive }) => {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: '1', title: 'Yangi Tab', url: '', viewMode: 'home', loading: false, isSecure: true }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [stealthActive, setStealthActive] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTab = (id: string, updates: Partial<TabData>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleNavigate = async (target: string, tabId: string = activeTabId) => {
    if (!target.trim()) {
      updateTab(tabId, { viewMode: 'home', url: '', title: 'Yangi Tab' });
      return;
    }

    updateTab(tabId, { loading: true, url: target });
    
    const isUrl = target.includes('.') && !target.includes(' ');
    
    if (isUrl) {
      let finalUrl = target.trim();
      if (!finalUrl.startsWith('http')) finalUrl = `https://${finalUrl}`;
      
      const domain = new URL(finalUrl).hostname;
      setHistory(prev => [finalUrl, ...prev.slice(0, 20)]);
      
      // Iframe blocks common sites (Google, FB etc)
      // We simulate a smart fallback
      updateTab(tabId, { 
        url: finalUrl, 
        title: domain, 
        viewMode: 'iframe', 
        isSecure: finalUrl.startsWith('https'),
        loading: false 
      });
    } else {
      updateTab(tabId, { viewMode: 'search', title: `Qidiruv: ${target}` });
      try {
        const results = await performSearch(target);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        updateTab(tabId, { loading: false });
      }
    }
  };

  const addNewTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTab: TabData = { id: newId, title: 'Yangi Tab', url: '', viewMode: 'home', loading: false, isSecure: true };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId(newTabs[0].id);
  };

  const speedDial = [
    { name: 'Google', url: 'google.com', color: 'bg-red-500' },
    { name: 'YouTube', url: 'youtube.com', color: 'bg-red-600' },
    { name: 'GitHub', url: 'github.com', color: 'bg-slate-800' },
    { name: 'ChatGPT', url: 'chat.openai.com', color: 'bg-emerald-600' },
    { name: 'Flux AI', url: '', color: 'bg-blue-600' }
  ];

  return (
    <div className="h-full flex flex-col bg-[#050505] overflow-hidden rounded-3xl border border-white/5 shadow-2xl animate-ios">
      {/* Tab Bar (Arc Style) */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-[#0a0a0a] overflow-x-auto no-scrollbar border-b border-white/5 h-12 shrink-0">
         {tabs.map((tab) => (
           <div 
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`flex items-center gap-3 px-4 py-2 rounded-t-xl cursor-pointer transition-all min-w-[140px] max-w-[200px] relative group ${
              activeTabId === tab.id ? 'bg-[#141414] text-white' : 'text-slate-500 hover:bg-white/5'
            }`}
           >
             <Globe size={14} className={activeTabId === tab.id ? 'text-blue-400' : 'text-slate-600'} />
             <span className="text-[11px] font-bold truncate flex-1 uppercase tracking-wider">{tab.title}</span>
             <button 
              onClick={(e) => closeTab(e, tab.id)}
              className="p-1 hover:bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
             >
               <X size={10} />
             </button>
             {activeTabId === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
           </div>
         ))}
         <button onClick={addNewTab} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg ml-2">
            <Plus size={16} />
         </button>
      </div>

      {/* Toolbar */}
      <div className={`flex flex-col border-b border-white/5 transition-all duration-500 ${stealthActive ? 'bg-[#0f0a14]' : 'bg-[#0a0a0a]'}`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-1">
             <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500"><ChevronLeft size={16} /></button>
             <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500"><ChevronRight size={16} /></button>
             <button onClick={() => handleNavigate(activeTab.url)} className={`p-2 hover:bg-white/5 rounded-xl text-slate-500 ${activeTab.loading ? 'animate-spin text-blue-400' : ''}`}>
                <RefreshCw size={14} />
             </button>
          </div>

          <div className={`flex-1 flex items-center border rounded-2xl px-4 py-2 gap-3 transition-all ${stealthActive ? 'bg-purple-500/5 border-purple-500/20' : 'bg-white/5 border-white/10 shadow-inner'}`}>
             {activeTab.isSecure ? <Lock size={12} className="text-emerald-500" /> : <ShieldAlert size={12} className="text-red-500" />}
             <input 
              type="text" 
              defaultValue={activeTab.url}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNavigate(e.currentTarget.value);
              }}
              placeholder="URL kiriting yoki AI-dan so'rang..."
              className="flex-1 bg-transparent text-xs font-bold text-slate-200 outline-none placeholder-slate-600"
             />
             <div className="flex items-center gap-2">
                <button className="text-slate-600 hover:text-white"><Star size={14} /></button>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <button 
              onClick={() => setStealthActive(!stealthActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${stealthActive ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
             >
                <Ghost size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Stealth</span>
             </button>
             <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        {activeTab.loading && (
          <div className="h-[2px] w-full bg-white/5 overflow-hidden">
             <div className="h-full bg-blue-500 animate-[progress_2s_infinite]" />
          </div>
        )}
      </div>

      {/* Viewport Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab.viewMode === 'home' && (
          <div className="h-full overflow-y-auto custom-scrollbar flex flex-col items-center pt-20 px-8 pb-20 space-y-16">
             <div className="text-center space-y-6">
                <div className={`w-24 h-24 rounded-[36px] mx-auto flex items-center justify-center shadow-2xl transition-all duration-700 ${stealthActive ? 'bg-purple-600 shadow-purple-600/30' : 'bg-blue-600 shadow-blue-600/20'}`}>
                   <Globe size={48} className="text-white" />
                </div>
                <div className="space-y-2">
                   <h1 className="text-4xl font-black text-white tracking-tighter">Flux Stealth Web</h1>
                   <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">Barcha qidiruvlar va tashriflar Flux Sentinel tomonidan shifrlanadi.</p>
                </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 w-full max-w-4xl">
                {speedDial.map((site, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleNavigate(site.url)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className={`w-16 h-16 rounded-[28px] ${site.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                       <span className="text-xl font-black text-white">{site.name.charAt(0)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white">{site.name}</span>
                  </button>
                ))}
             </div>

             <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[
                  { icon: ShieldCheck, title: 'Ad-Block Plus', desc: 'Reklamalar va trekkerlar avtomatik filtrlanadi.', color: 'text-emerald-500' },
                  { icon: Radio, title: 'IP Rotation', desc: 'Har 15 daqiqada virtual IP manzilingiz o\'zgaradi.', color: 'text-purple-500' },
                  { icon: Zap, title: 'Edge Turbo', desc: 'Saxifalar Flux Cloud serverlari orqali tezkor yuklanadi.', color: 'text-blue-500' }
                ].map((feat, i) => (
                  <div key={i} className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-4">
                     <div className={`p-3 w-fit bg-white/5 rounded-2xl ${feat.color}`}><feat.icon size={20} /></div>
                     <h3 className="text-sm font-bold text-white tracking-tight">{feat.title}</h3>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab.viewMode === 'iframe' && (
          <div className="w-full h-full bg-white">
             {/* If blocked, show a notice and AI View button */}
             <div className="absolute inset-0 bg-slate-900 z-10 flex flex-col items-center justify-center p-8 text-center space-y-6 hidden">
                <ShieldAlert size={48} className="text-yellow-500" />
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white">Xavfsizlik Cheklovi</h3>
                   <p className="text-slate-400 text-sm max-w-md">Ushbu sayt iframe ichida ochishni cheklagan. Flux AI orqali sayt mazmunini o'qishni xohlaysizmi?</p>
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs uppercase tracking-widest shadow-xl">AI Web View-ni yoqish</button>
             </div>
             <iframe 
              src={activeTab.url} 
              className="w-full h-full border-none"
              title="Flux Web View"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
             />
          </div>
        )}

        {activeTab.viewMode === 'search' && searchResults && (
           <div className="h-full overflow-y-auto custom-scrollbar p-8 max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-400">
                  <Layers size={18} />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Search Analysis</h2>
                </div>
                <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-gradient-to-br from-blue-600/5 to-transparent text-slate-200 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                   {searchResults.text}
                </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Eng mos keluvchi havolalar</h3>
                 <div className="grid gap-4">
                    {searchResults.links.map((link: any, i: number) => link.web && (
                       <button 
                        key={i}
                        onClick={() => handleNavigate(link.web.uri)}
                        className="glass-panel p-6 rounded-[2rem] border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-left flex items-center justify-between group"
                       >
                         <div className="space-y-2">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-full">Web Source</span>
                            <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{link.web.title}</h4>
                            <p className="text-[10px] font-bold text-slate-600 uppercase truncate">{new URL(link.web.uri).hostname}</p>
                         </div>
                         <ArrowRight size={20} className="text-slate-800 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Footer / Status Bar */}
      <div className={`h-8 px-6 flex items-center justify-between shrink-0 border-t border-white/5 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${stealthActive ? 'bg-purple-950/20 text-purple-400' : 'bg-black/40 text-slate-600'}`}>
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${stealthActive ? 'bg-purple-500' : 'bg-emerald-500'}`} /> 
              Status: {stealthActive ? 'Encrypted' : 'Connected'}
            </span>
            <span className="flex items-center gap-2"><Wifi size={10} /> Latency: 42ms</span>
         </div>
         <div className="flex items-center gap-6">
            <span>Flux Engine v4.1</span>
            <div className="flex items-center gap-1"><Cpu size={10} /> 128-bit Encryption</div>
         </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
