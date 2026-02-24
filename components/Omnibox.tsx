
import React, { useState, useEffect } from 'react';
import { Search, Globe, ChevronLeft, ChevronRight, RotateCw, Command } from 'lucide-react';

interface OmniboxProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export const Omnibox: React.FC<OmniboxProps> = ({ onSearch, initialValue }) => {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    if (initialValue !== undefined) setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  return (
    <div className="flex-1 max-w-2xl flex items-center gap-4">
      <div className="flex items-center gap-1 text-slate-500">
        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={18} /></button>
        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><RotateCw size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Globe size={14} className="text-blue-400/70" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="AI-dan so'rang yoki URL kiriting..."
          className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-1.5 pl-9 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all omnibox-shadow text-slate-200"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none gap-1">
          <Command size={10} className="text-slate-500" />
          <span className="text-[10px] font-bold text-slate-500">K</span>
        </div>
      </form>
    </div>
  );
};
