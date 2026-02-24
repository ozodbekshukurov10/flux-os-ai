
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, ExternalLink, Loader2, BookOpen, Layers, Share2, Zap } from 'lucide-react';
import { performSearch } from '../services/aiService';

interface FluxSearchProps {
  externalQuery?: string;
  isHyperLinkActive?: boolean;
}

export const FluxSearch: React.FC<FluxSearchProps> = ({ externalQuery, isHyperLinkActive }) => {
  const [query, setQuery] = useState(externalQuery || '');
  const [results, setResults] = useState<{ text: string, links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (externalQuery) {
      handleSearch(null, externalQuery);
    }
  }, [externalQuery]);

  const handleSearch = async (e: React.FormEvent | null, forcedQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = forcedQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    // Simulation of faster response if hyper link is active
    const delay = isHyperLinkActive ? 800 : 2500;
    
    try {
      // Small artificial delay to show off the hyper-speed
      await new Promise(r => setTimeout(r, delay));
      const data = await performSearch(activeQuery);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-ios">
      {isHyperLinkActive && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl w-fit mx-auto animate-pulse">
           <Zap size={12} className="text-cyan-400 fill-current" />
           <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Hyper-Link Optimization Active</span>
        </div>
      )}

      {!results && !loading && (
        <div className="text-center py-20 space-y-6">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transition-all duration-500 ${isHyperLinkActive ? 'bg-cyan-500/20 shadow-cyan-500/20' : 'bg-blue-600/10'}`}>
            <SearchIcon size={40} className={isHyperLinkActive ? 'text-cyan-400' : 'text-blue-500'} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Flux AI bilan chuqur izlanish</h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm font-medium">
            Haqiqiy vaqt rejimida dunyo bo'ylab ma'lumotlarni tahlil qiling va ishonchli manbalarga ega bo'ling.
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-8 animate-pulse">
          <div className="h-8 bg-white/5 w-1/3 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 bg-white/5 w-full rounded-lg" />
            <div className="h-4 bg-white/5 w-5/6 rounded-lg" />
            <div className="h-4 bg-white/5 w-4/6 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-white/5 rounded-2xl" />
            <div className="h-24 bg-white/5 rounded-2xl" />
          </div>
        </div>
      )}

      {results && !loading && (
        <div className="animate-ios space-y-8">
          {/* Answer Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Layers size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">AI Xulosasi</h3>
            </div>
            <div className="glass-panel p-10 rounded-[40px] relative overflow-hidden border border-white/5 shadow-2xl">
               <div className="absolute top-0 right-0 p-4 flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><Share2 size={16} /></button>
               </div>
               <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {results.text}
              </div>
            </div>
          </section>

          {/* Sources Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <BookOpen size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Manbalar va Havolalar</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.links?.map((chunk: any, i: number) => (
                chunk.web && (
                  <a 
                    key={i} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group shadow-xl"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {chunk.web.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-600 truncate uppercase tracking-widest">{new URL(chunk.web.uri).hostname}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[9px] font-black px-3 py-1 bg-white/5 rounded-full text-slate-400 uppercase tracking-widest">Website</span>
                      <ExternalLink size={14} className="text-slate-700 group-hover:text-blue-400" />
                    </div>
                  </a>
                )
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
