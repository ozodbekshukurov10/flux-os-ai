
import React, { useState, useRef } from 'react';
import { analyzeProjectImage } from '../services/geminiService';

interface Finding {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
}

export const FileAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Finding[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResults(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeProjectImage(base64Data);
      setResults(analysis);
    } catch (err) {
      setError("Tahlil qilishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700 p-8 text-center transition-all hover:border-blue-500/50">
        {!image ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Rasm yuklash</p>
              <p className="text-slate-500 text-sm">PNG, JPG (Maks. 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Faylni tanlash
            </button>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={image} 
              alt="Uploaded structure" 
              className="max-h-96 mx-auto rounded-lg shadow-2xl border border-slate-600"
            />
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {image && !results && !isAnalyzing && (
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-xl shadow-emerald-900/20 transition-all transform hover:scale-105"
          >
            Tahlilni boshlash
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-medium animate-pulse">AI loyihani o'rganmoqda...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {results && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Tahlil natijalari
          </h3>
          <div className="grid gap-4">
            {results.map((finding, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border bg-slate-800/50 ${
                  finding.type === 'error' ? 'border-red-500/30' : 
                  finding.type === 'warning' ? 'border-yellow-500/30' : 'border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg ${
                    finding.type === 'error' ? 'bg-red-500/20 text-red-500' : 
                    finding.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    {finding.type === 'error' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-white mb-2">{finding.title}</h4>
                    <p className="text-slate-400 mb-4">{finding.description}</p>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tavsiya</p>
                      <p className="text-emerald-400 text-sm font-medium">{finding.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
