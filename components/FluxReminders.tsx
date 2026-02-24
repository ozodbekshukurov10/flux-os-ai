
import React, { useState, useEffect } from 'react';
import { 
  Bell, Calendar, Clock, Plus, Trash2, CheckCircle2, 
  Circle, AlertCircle, Sparkles, Send, Loader2, Zap
} from 'lucide-react';
import { parseReminderIntent } from '../services/aiService';

interface Reminder {
  id: string;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  isSmart?: boolean;
}

export const FluxReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [smartInput, setSmartInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    const saved = localStorage.getItem('flux_reminders');
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('flux_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleSmartAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartInput.trim()) return;

    setLoading(true);
    try {
      const parsed = await parseReminderIntent(smartInput);
      if (parsed) {
        const newReminder: Reminder = {
          id: Date.now().toString(),
          title: parsed.title,
          time: parsed.time,
          date: parsed.date,
          completed: false,
          isSmart: true
        };
        setReminders(prev => [newReminder, ...prev]);
        setSmartInput('');
      }
    } catch (err) {
      console.error("Reminder parsing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const filteredReminders = reminders.filter(r => 
    activeTab === 'active' ? !r.completed : r.completed
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-ios pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Bell className="text-blue-500" size={32} /> Eslatmalar
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Smart AI orqali topshiriqlarni boshqaring.</p>
        </div>

        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Faol ({reminders.filter(r => !r.completed).length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'completed' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Bajarildi
          </button>
        </div>
      </div>

      {/* Smart Input Area */}
      <section className="glass-panel p-2 rounded-[2rem] border border-white/10 shadow-2xl group focus-within:border-blue-500/40 transition-all bg-[#141414]/60">
        <form onSubmit={handleSmartAdd} className="relative flex items-center gap-2">
          <div className="pl-4 text-blue-500">
             <Sparkles size={18} className={loading ? 'animate-spin' : 'animate-pulse'} />
          </div>
          <input 
            type="text"
            value={smartInput}
            onChange={(e) => setSmartInput(e.target.value)}
            disabled={loading}
            placeholder="Menga soat 18:00 da kitob o'qishni eslat..."
            className="flex-1 bg-transparent py-4 px-2 focus:outline-none text-slate-200 placeholder-slate-600 text-sm font-bold"
          />
          <button 
            type="submit"
            disabled={loading || !smartInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 mr-1"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </section>

      {/* Reminders List */}
      <div className="grid gap-4">
        {filteredReminders.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-slate-700">
                <Bell size={32} />
             </div>
             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Hozircha eslatmalar yo'q</p>
          </div>
        ) : (
          filteredReminders.map((item) => (
            <div 
              key={item.id} 
              className={`glass-panel p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all animate-in slide-in-from-bottom-2 ${item.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => toggleComplete(item.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white/5 border border-white/10 text-slate-600 hover:border-blue-500/50'}`}
                >
                  {item.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-lg font-bold transition-all ${item.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    {item.isSmart && <Zap size={10} className="text-blue-500 fill-current" />}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {item.date}</div>
                    <div className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-500" /> {item.time}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => deleteReminder(item.id)}
                className="p-3 bg-red-500/0 hover:bg-red-500/10 text-slate-700 hover:text-red-500 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* System Note */}
      <div className="p-6 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10 flex items-start gap-4">
        <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
          <AlertCircle size={18} />
        </div>
        <div>
          <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Eslatma bildirishnomalari</h5>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Flux OS belgilangan vaqtda sizga tizim orqali bildirishnoma yuboradi. Buning uchun brauzeringizda bildirishnomalarga ruxsat berilgan bo'lishi kerak.
          </p>
        </div>
      </div>
    </div>
  );
};
