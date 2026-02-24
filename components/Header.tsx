
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            CA
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            CodeAuditor <span className="text-blue-500">AI</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Bosh sahifa</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Qo'llanma</a>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
            Bog'lanish
          </button>
        </nav>
      </div>
    </header>
  );
};
