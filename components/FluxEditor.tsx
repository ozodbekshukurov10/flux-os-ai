
import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, Save, Play, RefreshCw, Sparkles, Send, 
  Terminal, FileCode, Search, Settings, 
  ChevronRight, BrainCircuit, Bug, CheckCircle2,
  Copy, Trash2, Layout, Maximize2, Share2, AlertCircle, Loader2,
  Files, FolderTree, Blocks, Layers, Braces, 
  Cpu, Zap, X, ChevronDown, SplitSquareVertical,
  ChevronLeft, Ghost, Wand2, Lightbulb, Plus
} from 'lucide-react';
import { codeAssistance } from '../services/aiService';

interface FileEntry {
  id: string;
  name: string;
  language: 'javascript' | 'python' | 'html' | 'json';
  content: string;
  isOpen: boolean;
}

export const FluxEditor: React.FC = () => {
  const [files, setFiles] = useState<FileEntry[]>([
    { id: '1', name: 'main.js', language: 'javascript', content: 'function calculateFlux() {\n  const energy = 42;\n  console.log("Flux Core optimized: " + energy);\n}\n\ncalculateFlux();', isOpen: true },
    { id: '2', name: 'system.py', language: 'python', content: 'def flux_init():\n    print("Python Neural Engine active")\n\nif __name__ == "__main__":\n    flux_init()', isOpen: true },
    { id: '3', name: 'config.json', language: 'json', content: '{\n  "version": "3.1.0",\n  "ai_mode": "quantum",\n  "theme": "nebula-dark"\n}', isOpen: false }
  ]);

  const [activeFileId, setActiveFileId] = useState('1');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[Flux-Terminal] Welcome to Flux IDE v2.0', '[System] AI Neural Bridge connected.']);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'explorer' | 'ai' | 'search'>('explorer');
  const [showPanel, setShowPanel] = useState(true);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleUpdateContent = (newContent: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleAiAssist = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    setSidebarTab('ai');
    
    try {
      const result = await codeAssistance(promptToUse, activeFile.content);
      setAiResponse(result || null);
    } catch (err) {
      console.error(err);
      setTerminalLogs(prev => [...prev, `[AI-Error] Could not reach Flux Neural Server.`]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const runCode = () => {
    setTerminalLogs(prev => [...prev, `[Executing] ${activeFile.name}...`]);
    setTimeout(() => {
      if (activeFile.language === 'javascript') {
        setTerminalLogs(prev => [...prev, `[Output] Flux Core optimized: 42`, `[Done] Process exited with code 0`]);
      } else {
        setTerminalLogs(prev => [...prev, `[Output] Simulation successful for ${activeFile.language}`, `[Done] Execution finished.`]);
      }
    }, 800);
  };

  const applyAiCode = () => {
    if (aiResponse) {
      const codeMatch = aiResponse.match(/```(?:\w+)?\n([\s\S]*?)```/);
      const extractedCode = codeMatch ? codeMatch[1] : aiResponse;
      handleUpdateContent(extractedCode);
      setAiResponse(null);
      setAiPrompt('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-[#d4d4d4] overflow-hidden select-none">
      
      {/* 1. TOP ACTIVITY BAR (VS Code Style) */}
      <div className="h-10 flex items-center justify-between px-3 bg-[#1e1e1e] border-b border-white/5 z-20 shrink-0">
        <div className="flex items-center gap-4 h-full">
           <div className="flex items-center gap-2 text-blue-500 mr-2">
              <Zap size={16} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Flux IDE</span>
           </div>
           <div className="flex h-full">
              {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
                <button key={item} className="px-3 hover:bg-white/5 text-[11px] text-slate-400 hover:text-white transition-colors h-full">{item}</button>
              ))}
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <RefreshCw size={10} className={isAiLoading ? 'animate-spin' : ''} /> Auto-Save Active
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. NARROW LEFT SIDEBAR (Icons Only) */}
        <aside className="w-12 bg-[#181818] border-r border-white/5 flex flex-col items-center py-4 gap-6 shrink-0">
           <button onClick={() => setSidebarTab('explorer')} className={`p-2 transition-all ${sidebarTab === 'explorer' ? 'text-white border-l-2 border-white bg-white/5' : 'text-slate-600 hover:text-slate-400'}`}>
              <Files size={22} />
           </button>
           <button onClick={() => setSidebarTab('search')} className={`p-2 transition-all ${sidebarTab === 'search' ? 'text-white border-l-2 border-white bg-white/5' : 'text-slate-600 hover:text-slate-400'}`}>
              <Search size={22} />
           </button>
           <button onClick={() => setSidebarTab('ai')} className={`p-2 transition-all ${sidebarTab === 'ai' ? 'text-blue-500 border-l-2 border-blue-500 bg-white/5' : 'text-slate-600 hover:text-slate-400'}`}>
              <BrainCircuit size={22} />
           </button>
           <div className="mt-auto pb-4 flex flex-col items-center gap-6">
              <button className="text-slate-600 hover:text-white"><Settings size={22} /></button>
           </div>
        </aside>

        {/* 3. WIDE SIDEBAR (Explorer or AI Chat) */}
        <aside className="w-64 bg-[#1e1e1e] border-r border-white/5 flex flex-col shrink-0 hidden md:flex">
           {sidebarTab === 'explorer' && (
             <div className="flex flex-col h-full animate-ios">
                <div className="p-4 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Explorer</span>
                   <button className="p-1 hover:bg-white/5 rounded-md text-slate-600"><Plus size={14} /></button>
                </div>
                <div className="p-2 space-y-0.5 overflow-y-auto custom-scrollbar flex-1">
                   <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-slate-600 uppercase mb-2">
                      <ChevronDown size={12} /> Flux-Project
                   </div>
                   {files.map(file => (
                     <button 
                       key={file.id}
                       onClick={() => setActiveFileId(file.id)}
                       className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${activeFileId === file.id ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                     >
                       <FileCode size={14} className={activeFileId === file.id ? 'text-blue-400' : 'text-slate-600'} />
                       {file.name}
                     </button>
                   ))}
                </div>
             </div>
           )}

           {sidebarTab === 'ai' && (
             <div className="flex flex-col h-full bg-[#111] animate-ios">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-blue-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Flux AI Assistant</span>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                   {!aiResponse && !isAiLoading && (
                     <div className="space-y-4 mt-4">
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                          Ushbu faylni tahlil qilish yoki yangi kod yozishni so'rang.
                        </p>
                        <div className="grid gap-2">
                           {[
                             { label: 'Kodni optimallashtirish', prompt: 'Ushbu kodni optimallashtir va unumdorlikni oshir' },
                             { label: 'Xatolarni tuzatish', prompt: 'Koddagi mantiqiy xatolarni top va tuzat' },
                             { label: 'Izohlar qo\'shish', prompt: 'Kodni har bir qatoriga tushunarli izohlar yoz' }
                           ].map((cmd, i) => (
                             <button 
                              key={i}
                              onClick={() => { setAiPrompt(cmd.prompt); handleAiAssist(cmd.prompt); }}
                              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 transition-all flex items-center justify-between group"
                             >
                               {cmd.label}
                               <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                             </button>
                           ))}
                        </div>
                     </div>
                   )}
                   {isAiLoading && (
                     <div className="py-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">Analyzing context...</p>
                     </div>
                   )}
                   {aiResponse && (
                     <div className="space-y-4 animate-ios">
                        <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
                           <p className="text-[11px] text-blue-300 whitespace-pre-wrap">{aiResponse}</p>
                        </div>
                        <button onClick={applyAiCode} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all">
                           <CheckCircle2 size={14} /> Kodga tatbiq etish
                        </button>
                        <button onClick={() => setAiResponse(null)} className="w-full py-2 text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">Bekor qilish</button>
                     </div>
                   )}
                </div>
                <div className="p-4 border-t border-white/5">
                   <div className="relative">
                      <textarea 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="AI so'rovi..."
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-3 pr-10 text-[11px] text-white focus:outline-none focus:border-blue-500/50 resize-none min-h-[80px]"
                      />
                      <button 
                        onClick={() => handleAiAssist()}
                        disabled={isAiLoading || !aiPrompt.trim()}
                        className="absolute bottom-2 right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30"
                      >
                        <Send size={14} />
                      </button>
                   </div>
                </div>
             </div>
           )}
        </aside>

        {/* 4. MAIN EDITOR CONTAINER */}
        <div className="flex-1 flex flex-col overflow-hidden">
           
           {/* Tab Bar */}
           <div className="h-9 flex bg-[#1e1e1e] border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
              {files.filter(f => f.isOpen || activeFileId === f.id).map(file => (
                <div 
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`flex items-center gap-2 px-4 h-full cursor-pointer text-[12px] font-medium transition-all relative border-r border-white/5 ${activeFileId === file.id ? 'bg-[#050505] text-white' : 'text-slate-500 hover:bg-white/5'}`}
                >
                  <FileCode size={14} className={file.language === 'javascript' ? 'text-yellow-400' : 'text-blue-400'} />
                  {file.name}
                  {activeFileId === file.id && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}
                  <button className="ml-2 hover:bg-white/10 p-0.5 rounded text-slate-700 hover:text-white"><X size={12} /></button>
                </div>
              ))}
              <button className="px-4 text-slate-600 hover:text-white transition-colors"><Plus size={14} /></button>
           </div>

           {/* Breadcrumbs */}
           <div className="h-6 flex items-center px-4 bg-[#050505] text-[10px] text-slate-500 font-medium border-b border-white/5 shrink-0">
              <span>Flux Project</span> <ChevronRight size={10} className="mx-1" />
              <span>src</span> <ChevronRight size={10} className="mx-1" />
              <span className="text-slate-300">{activeFile.name}</span>
           </div>

           {/* Actual Text Area */}
           <div className="flex-1 flex overflow-hidden">
              <div className="w-12 bg-[#050505] border-r border-white/5 flex flex-col items-center pt-4 select-none shrink-0 overflow-hidden">
                 {Array.from({length: 100}).map((_, i) => (
                   <div key={i} className="h-6 text-[11px] font-mono text-slate-700 flex items-center justify-center w-full shrink-0">{i + 1}</div>
                 ))}
              </div>
              <div className="flex-1 relative flex flex-col">
                 <textarea 
                   value={activeFile.content}
                   onChange={(e) => handleUpdateContent(e.target.value)}
                   spellCheck={false}
                   className="w-full h-full bg-[#050505] p-4 font-mono text-[14px] leading-6 text-[#9cdcfe] outline-none resize-none custom-scrollbar"
                 />
                 
                 {/* Floating Quick Actions (Hover) */}
                 <div className="absolute top-4 right-8 flex gap-2 z-10">
                    <button onClick={runCode} className="p-2 bg-emerald-600/90 text-white rounded-lg shadow-xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4">
                       <Play size={12} className="fill-current" /> Run Code
                    </button>
                    <button onClick={() => { setAiPrompt('Ushbu kodni optimallashtir'); handleAiAssist('Ushbu kodni optimallashtir'); }} className="p-2 bg-blue-600/90 text-white rounded-lg shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4">
                       <Wand2 size={12} /> AI Refactor
                    </button>
                 </div>
              </div>
           </div>

           {/* Panel (Terminal/Output) */}
           {showPanel && (
             <div className="h-56 bg-[#0a0a0a] border-t border-white/10 flex flex-col shrink-0">
                <div className="flex bg-[#1e1e1e] px-4 border-b border-white/5 shrink-0">
                   {['Terminal', 'Output', 'Debug Console', 'Problems'].map(tab => (
                     <button key={tab} className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest ${tab === 'Terminal' ? 'text-white border-b-2 border-white' : 'text-slate-500 hover:text-slate-300'}`}>
                        {tab}
                     </button>
                   ))}
                   <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => setTerminalLogs([])} className="p-1.5 text-slate-600 hover:text-white"><Trash2 size={14} /></button>
                      <button onClick={() => setShowPanel(false)} className="p-1.5 text-slate-600 hover:text-white"><X size={14} /></button>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px] bg-black/40 custom-scrollbar">
                   {terminalLogs.map((log, i) => (
                     <div key={i} className="flex gap-4 mb-1 border-b border-white/5 pb-1 opacity-80 animate-in fade-in duration-300">
                        <span className="text-slate-700 shrink-0">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: false})}]</span>
                        <span className={`${log.includes('[Output]') ? 'text-emerald-400 font-bold' : log.includes('[Error]') ? 'text-red-400' : 'text-blue-400'}`}>
                          {log}
                        </span>
                     </div>
                   ))}
                   <div className="w-2 h-4 bg-emerald-500 inline-block animate-pulse align-middle ml-1" />
                </div>
             </div>
           )}

        </div>
      </div>

      {/* 5. BOTTOM STATUS BAR */}
      <footer className="h-6 flex items-center justify-between px-3 bg-blue-600 text-white text-[11px] font-medium shrink-0">
         <div className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
               <SplitSquareVertical size={12} />
               <span>Main</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
               <RefreshCw size={12} />
               <span>0</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
               <AlertCircle size={12} />
               <span>0</span>
            </div>
         </div>
         <div className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
               <span>Ln 12, Col 42</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors uppercase">
               <span>Spaces: 2</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
               <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors capitalize">
               <span>{activeFile.language}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 h-full cursor-pointer transition-colors">
               <Zap size={12} className="fill-current" />
               <span className="font-bold">FLUX SENTINEL ACTIVE</span>
            </div>
         </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
