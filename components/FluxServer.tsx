
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Globe, RefreshCw, Zap, AlertCircle } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  source: 'main.py' | 'main.js' | 'system';
  message: string;
  type: 'info' | 'error' | 'success';
}

export const FluxServer: React.FC = () => {
  const [isPythonRunning, setIsPythonRunning] = useState(true);
  const [isJsRunning, setIsJsRunning] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [cpuLoad, setCpuLoad] = useState(8.4);
  const [ramUsed, setRamUsed] = useState(0.9);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (source: LogEntry['source'], message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      source,
      message,
      type
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    addLog('system', 'Initializing server environment...', 'info');
    setTimeout(() => addLog('system', 'Virtual environment for Python created.', 'success'), 500);
    setTimeout(() => addLog('system', 'Node.js modules linked.', 'success'), 1000);
    
    const jitter = setInterval(() => {
      setCpuLoad(prev => Math.max(4.2, Math.min(18.5, prev + (Math.random() - 0.5) * 2)));
      setRamUsed(prev => Math.max(0.85, Math.min(1.15, prev + (Math.random() - 0.5) * 0.05)));
    }, 2000);

    const interval = setInterval(() => {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => {
          addLog('system', `Backend ping: ${data.status} (v${data.version})`, 'success');
        })
        .catch(err => {
          addLog('system', 'Backend connection failed', 'error');
        });
    }, 10000);
    return () => {
      clearInterval(jitter);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isPythonRunning) {
      addLog('main.py', 'Process terminated.', 'error');
      return;
    }
    addLog('main.py', 'AI Core started (Python 3.11).', 'success');
    
    const interval = setInterval(() => {
      const messages = [
        "Gemini API handshake successful.",
        "Processing vector embeddings for current user session...",
        "Python garbage collection: freed 42MB.",
        "Neural network weights synchronized.",
        "Listening for AI inference requests on port 5000."
      ];
      addLog('main.py', messages[Math.floor(Math.random() * messages.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPythonRunning]);

  useEffect(() => {
    if (!isJsRunning) {
      addLog('main.js', 'Service stopped.', 'error');
      return;
    }
    addLog('main.js', 'API Gateway active (Node.js v20).', 'success');

    const interval = setInterval(() => {
      const messages = [
        "GET /api/v1/auth/validate - 200 OK",
        "Websocket broadcast: New session data synchronized.",
        "Flux Search bridge established with Google Cloud.",
        "Express server listening on port 3000.",
        "Response time: 42ms."
      ];
      addLog('main.js', messages[Math.floor(Math.random() * messages.length)]);
    }, 2800);
    return () => clearInterval(interval);
  }, [isJsRunning]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Terminal className="text-emerald-400" />
            </div>
            Flux Server Console
          </h2>
          <p className="text-slate-500 text-sm mt-1">Python va JavaScript backend xizmatlarini boshqarish markazi.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setLogs([])} className="px-4 py-2 glass-panel rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <RefreshCw size={14} /> Loglarni tozalash
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Cpu size={18} /> <span className="text-xs font-bold uppercase tracking-widest">CPU Tizim</span>
            </div>
            <span className="text-lg font-mono font-bold text-white tabular-nums">{cpuLoad.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${cpuLoad}%` }} />
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Xotira (RAM)</span>
            </div>
            <span className="text-lg font-mono font-bold text-white tabular-nums">{ramUsed.toFixed(2)} GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(ramUsed / 16) * 100 + 10}%` }} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-orange-400">
              <Globe size={18} /> <span className="text-xs font-bold uppercase tracking-widest">API So'rovlar</span>
            </div>
            <span className="text-lg font-mono font-bold text-white">Active</span>
          </div>
          <div className="flex gap-1">
             {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className={`flex-1 h-6 rounded-sm transition-colors duration-500 ${i < (cpuLoad/2) ? 'bg-orange-500/40' : 'bg-slate-800'}`} />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Boshqaruv Paneli</h3>
            
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">main.py</span>
                  <div className={`w-2 h-2 rounded-full ${isPythonRunning ? 'bg-emerald-500 shadow-glow' : 'bg-red-500'}`} />
                </div>
                <button 
                  onClick={() => setIsPythonRunning(!isPythonRunning)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isPythonRunning ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {isPythonRunning ? 'To\'xtatish' : 'Ishga tushirish'}
                </button>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">main.js</span>
                  <div className={`w-2 h-2 rounded-full ${isJsRunning ? 'bg-emerald-500 shadow-glow' : 'bg-red-500'}`} />
                </div>
                <button 
                  onClick={() => setIsJsRunning(!isJsRunning)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isJsRunning ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {isJsRunning ? 'To\'xtatish' : 'Ishga tushirish'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-start gap-3 text-[10px] text-slate-500 leading-relaxed">
                <AlertCircle size={14} className="text-blue-500 shrink-0" />
                <span>Ushbu console real backend jarayonlarini frontend muhitida simulyatsiya qilmoqda.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden h-[540px] flex flex-col bg-black/40">
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Output Stream</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-500/70">SSH: localhost:3000</div>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 p-6 font-mono text-[12px] overflow-y-auto custom-scrollbar space-y-1.5 bg-black/20"
            >
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 animate-in fade-in duration-300">
                  <span className="text-slate-700 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`shrink-0 w-20 font-bold ${
                    log.source === 'main.py' ? 'text-blue-500' : 
                    log.source === 'main.js' ? 'text-emerald-500' : 'text-slate-500'
                  }`}>{log.source}</span>
                  <span className={
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              <div className="w-1.5 h-4 bg-emerald-500 inline-block animate-pulse ml-1 align-middle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
