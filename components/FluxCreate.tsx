
import React, { useState, useEffect } from 'react';
import { Palette, Download, Loader2, Sparkles, RefreshCw, Image as ImageIcon, AlertCircle, XCircle, Zap } from 'lucide-react';
import { generateFluxImage } from '../services/aiService';

export const FluxCreate: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
        try {
          const selected = await aiStudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          setHasKey(true); // Fallback for environments without the helper
        }
      } else {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      await aiStudio.openSelectKey();
      setHasKey(true);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);

    setLoading(true);
    try {
      const dataUrl = await generateFluxImage(prompt, aspectRatio);
      setImage(dataUrl);
    } catch (err: any) {
      console.error("Flux Generation Error:", err);
      setError(err?.message || "Kutilmagan xatolik yuz berdi. Qaytadan urinib ko'ring.");
      if (err?.message?.includes("404") || err?.message?.includes("not found")) {
        setHasKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const ratios = ["1:1", "16:9", "9:16", "4:3"];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Engine Status Header */}
      <div className="flex items-center justify-between px-6 py-3 glass-panel rounded-2xl border border-white/5 bg-blue-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
            <Zap size={18} className="fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Active Engine</p>
            <h4 className="text-sm font-bold text-white">Nano Banana v2.5 (Flash Image)</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-emerald-500 uppercase">Ready for inference</span>
        </div>
      </div>

      {error && (
        <div className="glass-panel p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="p-2 bg-red-500/10 rounded-xl text-red-500 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-400">Generatsiya xatoligi</p>
            <p className="text-xs text-red-400/80 leading-relaxed mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:bg-white/5 rounded-lg text-slate-500">
            <XCircle size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-[32px] space-y-6 border border-white/5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" /> Tasvir Tavsifi
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Nima yaratmoqchisiz? Masalan: 'Kosmosdagi shahar, neon chiroqlar...'"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[140px] text-sm text-white resize-none transition-all placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">O'lcham</label>
              <div className="grid grid-cols-2 gap-2">
                {ratios.map(r => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                      aspectRatio === r 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-30 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Palette size={20} /> Tasvirni yaratish</>}
            </button>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] text-slate-500 leading-relaxed text-center italic">
               "Nano Banana" modeli tasvirlarni soniyalar ichida qayta ishlaydi. Eng yaxshi natija uchun ingliz tilida batafsilroq yozing.
             </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-panel aspect-square lg:aspect-video rounded-[40px] flex items-center justify-center relative overflow-hidden group border border-white/5 bg-slate-900/20 shadow-2xl">
            {image ? (
              <>
                <img src={image} alt="Generated" className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <a 
                    href={image} 
                    download="nano-banana-art.png"
                    className="p-4 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-2xl"
                  >
                    <Download size={24} />
                  </a>
                  <button 
                    onClick={handleGenerate}
                    className="p-4 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform shadow-2xl"
                  >
                    <RefreshCw size={24} />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6 px-10 animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-white/5 rounded-[32px] mx-auto flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition-colors">
                  <ImageIcon size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Tasvir studiyasi</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Nano Banana AI yordamida g'oyalaringizni san'at asariga aylantiring
                  </p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-[#000]/60 backdrop-blur-xl flex flex-col items-center justify-center gap-6 z-30">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                  <Zap className="absolute inset-0 m-auto text-blue-500 animate-pulse fill-current" size={28} />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-xl text-white tracking-tight">Nano Banana Rendering...</p>
                  <p className="text-blue-500/70 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">Neural Compute Unit Active</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
