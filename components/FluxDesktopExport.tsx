
import React, { useState } from 'react';
import { 
  MonitorDown, Box, Terminal, Code2, 
  ChevronRight, Copy, CheckCircle2,
  HardDrive, Cpu, ShieldCheck, Rocket,
  Download, ExternalLink, Zap, Package, 
  Settings, Monitor, Laptop, FileJson, 
  ChevronDown, RefreshCw, Loader2, FolderTree,
  Terminal as TerminalIcon, Info, Layers, AlertCircle, HelpCircle
} from 'lucide-react';

export const FluxDesktopExport: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const electronCode = `const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#000000'
  });

  win.loadURL('https://flux-os-enterprise.web.app'); 
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});`;

  const packageJson = `{
  "name": "flux-os",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "dist": "electron-builder --win --x64"
  },
  "build": {
    "appId": "com.flux.os",
    "win": { "target": "nsis" }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  }
}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    { id: 1, title: 'Tayyorgarlik', desc: 'Muhitni sozlash' },
    { id: 2, title: 'Konfiguratsiya', desc: 'Fayllarni yaratish' },
    { id: 3, title: 'Build', desc: 'EXE tayyorlash' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-win-open pb-24">
      {/* Header */}
      <div className="glass-panel p-8 rounded-[40px] border border-white/10 bg-gradient-to-r from-blue-600/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
               <Package className="text-blue-500" /> Flux EXE Builder
            </h2>
            <p className="text-slate-500 text-sm font-medium">Loyiha kodlarini kompyuter dasturiga aylantirish markazi.</p>
         </div>
         
         <div className="flex items-center gap-4 bg-black/40 p-2 rounded-3xl border border-white/5">
            {steps.map((step) => (
              <button 
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${activeStep === step.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${activeStep === step.id ? 'bg-white text-blue-600' : 'bg-white/10 text-slate-500'}`}>
                  {step.id}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{step.title}</p>
                </div>
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           {activeStep === 1 && (
             <div className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 text-blue-400">
                   <Monitor size={24} />
                   <h3 className="text-xl font-bold text-white">1. Muhitni tayyorlash</h3>
                </div>
                
                <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-3xl space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TerminalIcon size={16} /> Terminalda bajaring:
                  </h4>
                  <div className="bg-black p-4 rounded-2xl border border-white/10 font-mono text-sm text-emerald-400">
                    mkdir FluxApp && cd FluxApp <br/>
                    npm init -y <br/>
                    npm install electron electron-builder --save-dev
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-yellow-500/5 rounded-3xl border border-yellow-500/10">
                   <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                   <div className="space-y-1">
                      <p className="text-xs text-white font-bold">MUHIM ESLATMA</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Agar sizda <b>"npm error Missing script: dist"</b> xatosi chiqsa, demak siz 2-qadamdagi <i>package.json</i> faylini to'liq nusxalamagansiz.
                      </p>
                   </div>
                </div>
                <button onClick={() => setActiveStep(2)} className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all">
                   2-qadam: Fayllarni nusxalash <ChevronRight size={16} />
                </button>
             </div>
           )}

           {activeStep === 2 && (
             <div className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 text-emerald-400">
                   <FileJson size={24} />
                   <h3 className="text-xl font-bold text-white">2. Fayllarni sozlash</h3>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between px-2">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">package.json (Xatolikni oldini olish uchun buni to'liq oling)</span>
                         <button onClick={() => copyToClipboard(packageJson, 'p')} className="text-[10px] font-bold text-blue-500 flex items-center gap-1"><Copy size={12}/> Nusxa olish</button>
                      </div>
                      <div className="bg-black/60 rounded-2xl border border-white/5 p-6 font-mono text-[12px] text-blue-400/80 max-h-60 overflow-y-auto custom-scrollbar">
                         {packageJson}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center justify-between px-2">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">main.js</span>
                         <button onClick={() => copyToClipboard(electronCode, 'm')} className="text-[10px] font-bold text-blue-500 flex items-center gap-1"><Copy size={12}/> Nusxa olish</button>
                      </div>
                      <div className="bg-black/60 rounded-2xl border border-white/5 p-6 font-mono text-[12px] text-emerald-500/80 max-h-48 overflow-y-auto custom-scrollbar">
                         {electronCode}
                      </div>
                   </div>
                </div>

                <button onClick={() => setActiveStep(3)} className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] transition-all">
                   3-qadam: Build jarayoni <ChevronRight size={16} />
                </button>
             </div>
           )}

           {activeStep === 3 && (
             <div className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-10 animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 text-purple-400">
                   <Rocket size={24} />
                   <h3 className="text-xl font-bold text-white">3. EXE yaratish</h3>
                </div>

                <div className="bg-black p-8 rounded-[32px] border border-white/10 text-center space-y-6">
                   <p className="text-slate-400 text-sm">Terminalda oxirgi buyruqni bering:</p>
                   <div className="inline-block bg-blue-600/10 px-8 py-4 rounded-2xl border border-blue-500/30 text-2xl font-mono text-blue-400">
                      npm run dist
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <p className="text-[11px] text-slate-500 font-medium">Bu buyruq 1-2 daqiqa vaqt oladi.</p>
                      <div className="flex gap-1">
                        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 flex items-start gap-4">
                   <HelpCircle size={20} className="text-blue-500 shrink-0" />
                   <div>
                      <h5 className="font-bold text-white text-sm">Xatolik chiqsa nima qilish kerak?</h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                         Agar terminalda <b>"Missing script: dist"</b> chiqsa, demak sizning <i>package.json</i> faylingiz bo'sh yoki noto'g'ri. 2-qadamga qaytib, ko'k rangli "Nusxa olish" tugmasini bosing va faylni boshidan saqlang.
                      </p>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="lg:col-span-4">
           <div className="glass-panel p-8 rounded-[40px] border border-white/10 bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col items-center text-center space-y-6 sticky top-8">
              <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl">
                 <Zap size={40} className="fill-current" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black text-white">Loyiha Ma'lumoti</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flux Core Architecture</p>
              </div>
              
              <div className="w-full space-y-3 pt-4">
                 <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Fayllar</span>
                    <span className="text-xs font-bold text-white">main.js, package.json</span>
                 </div>
                 <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Format</span>
                    <span className="text-xs font-bold text-emerald-500">Windows (.exe)</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
