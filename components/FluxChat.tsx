
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Copy, ThumbsUp, Trash2 } from 'lucide-react';
import { startChatSession } from '../services/aiService';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface FluxChatProps {
  user?: { name: string, email: string } | null;
}

export const FluxChat: React.FC<FluxChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = startChatSession(user?.name);
      }

      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "Xatolik yuz berdi. Iltimos, API kalitini tekshiring yoki qaytadan urinib ko'ring." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    chatRef.current = null;
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] relative">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flux AI Active Session</span>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={clearChat}
            className="text-[10px] font-bold text-slate-600 hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={12} /> Suhbatni tozalash
          </button>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-6 space-y-8 custom-scrollbar scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[60px] opacity-20 animate-pulse" />
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[32px] flex items-center justify-center relative z-10 shadow-2xl">
                 <Bot className="text-white" size={48} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-white tracking-tight">Qanday yordam bera olaman, {user?.name.split(' ')[0]}?</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                Gemini 3 Pro asosidagi Flux AI bilan murakkab loyihalarni rejalashtiring, kod yozing yoki shunchaki suhbatlashing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
               {['Dasturlash sirlari', 'Biznes reja tuzish', 'Tarixiy faktlar', 'She\'r yozish'].map(text => (
                 <button 
                   key={text}
                   onClick={() => setInput(text)}
                   className="p-3 rounded-2xl border border-white/5 bg-white/5 text-[11px] text-slate-400 hover:bg-white/10 hover:text-white transition-all text-left"
                 >
                   "{text}"
                 </button>
               ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex gap-4 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border border-white/10 ${
                m.role === 'user' ? 'bg-slate-800' : 'bg-blue-600'
              }`}>
                {m.role === 'user' ? <User size={20} className="text-slate-400" /> : <Bot size={20} className="text-white" />}
              </div>
              <div className={`flex flex-col space-y-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-[24px] text-[15px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/10' 
                    : 'glass-panel text-slate-200 rounded-tl-none border border-white/5 shadow-2xl'
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === 'model' && (
                  <div className="flex gap-4 px-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="text-slate-600 hover:text-blue-400 transition-colors" title="Nusxalash"><Copy size={13} /></button>
                    <button className="text-slate-600 hover:text-blue-400 transition-colors"><ThumbsUp size={13} /></button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex gap-4 md:gap-6 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex-shrink-0 flex items-center justify-center border border-blue-500/10">
               <Bot size={20} className="text-blue-500/50" />
            </div>
            <div className="glass-panel px-6 py-4 rounded-[24px] rounded-tl-none border border-white/5 flex items-center">
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce [animation-delay:-0.3s]" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 glass-panel p-2 rounded-[28px] shadow-2xl border border-white/10 group focus-within:border-blue-500/40 transition-all">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI bilan aqlli muloqotni boshlang..."
            className="flex-1 bg-transparent py-4 px-6 focus:outline-none text-slate-200 placeholder-slate-600 text-[15px]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-blue-600/30 mr-1 active:scale-90"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
      <p className="text-[10px] text-center text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">Flux Core AI Engine 3.0</p>
    </div>
  );
};
