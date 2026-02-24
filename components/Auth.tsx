
import React, { useState, useEffect } from 'react';
import { Zap, User, Power, ShieldCheck, ShieldAlert, Loader2, ArrowRight, UserPlus, Key, Check, Globe, Shield } from 'lucide-react';

interface AuthProps {
  onLogin: (user: {name: string, email: string, isAdmin: boolean, isSuperAdmin: boolean}) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('flux_remembered_node');
    if (saved) {
      try {
        const decoded = JSON.parse(atob(saved));
        setEmail(decoded.email || '');
        setPassword(decoded.password || '');
        setRememberMe(true);
      } catch (e) {
        console.error("Failed to recover remembered node data");
      }
    }
  }, []);

  const generateMockToken = (user: any) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ ...user, exp: Date.now() + 3600000 }));
    return `${header}.${payload}.mock_signature`;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      
      const finalizeLogin = (userData: any) => {
        const token = generateMockToken(userData);
        sessionStorage.setItem('flux_token', token);
        
        if (rememberMe) {
          const data = btoa(JSON.stringify({ email: normalizedEmail, password: password }));
          localStorage.setItem('flux_remembered_node', data);
        } else {
          localStorage.removeItem('flux_remembered_node');
        }
        
        onLogin(userData);
      };

      if (normalizedEmail === 'ozodbek201024@gmail.com' && password === 'ozodbek2010') {
        finalizeLogin({ name: 'Ozodbek', email: normalizedEmail, isAdmin: true, isSuperAdmin: true });
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem('flux_users') || '[]');

      if (isRegister) {
        if (storedUsers.find((u: any) => u.email === normalizedEmail)) {
          setError("Bu email allaqachon ro'yxatdan o'tgan.");
          setLoading(false);
          return;
        }
        const newUser = { name, email: normalizedEmail, password, isAdmin: false, isSuperAdmin: false };
        localStorage.setItem('flux_users', JSON.stringify([...storedUsers, newUser]));
        setIsRegister(false);
        setError("Muvaffaqiyatli! Endi login qiling.");
        setLoading(false);
      } else {
        const user = storedUsers.find((u: any) => u.email === normalizedEmail && u.password === password);
        if (user) {
          finalizeLogin({ name: user.name, email: user.email, isAdmin: false, isSuperAdmin: false });
        } else {
          setError("Email yoki parol xato.");
          setLoading(false);
        }
      }
    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-[#020202] flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10 px-6">
        <div className="glass-panel p-10 md:p-12 rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] animate-ios">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 relative group overflow-hidden">
               <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Zap size={32} className="text-white relative z-10 fill-current" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Flux Cloud OS</h1>
            <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">Neural Core Access v3.1</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5 group">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="To'liq ismingiz"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder-slate-600"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5 group">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email manzil"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Parol"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1 py-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                    rememberMe 
                      ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                      : 'bg-white/5 border-white/10 group-hover:border-white/20'
                  }`}
                >
                  {rememberMe && <Check size={12} className="text-white animate-in zoom-in duration-200" />}
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-400 transition-colors uppercase tracking-widest">Meni eslab qol</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-6 shadow-2xl hover:shadow-white/10 text-xs uppercase tracking-widest"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  {isRegister ? "Hisob yaratish" : "Tizimga kirish"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 pt-6 border-t border-white/5">
             <button 
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
             >
               {isRegister ? "Akkauntingiz bormi? Kirish" : "Yangi akkaunt ochish"}
             </button>
             
             {error && (
               <div className={`text-[10px] font-bold text-center p-3 rounded-xl border w-full animate-in slide-in-from-top-2 uppercase tracking-widest ${
                 error.includes('Muvaffaqiyatli') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
               }`}>
                 {error}
               </div>
             )}
          </div>
        </div>

        {/* Global Footer Info */}
        <div className="mt-12 flex flex-col items-center gap-6 opacity-40">
           <div className="flex items-center gap-8 text-[9px] font-black text-white uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><Shield size={12} /> Encrypted Node</span>
              <span className="flex items-center gap-2"><Globe size={12} /> Global Sync</span>
           </div>
           <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.5em]">Flux OS • Enterprise Architecture 2024</p>
        </div>
      </div>
    </div>
  );
};
