
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, Navigation, Info, 
  Compass, MapPin, Fuel, Coffee, ParkingCircle, 
  MoreHorizontal, Star, Clock, Phone, Globe,
  ChevronUp, ChevronDown, Locate, Share2, ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const FluxMaps: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [showSheet, setShowSheet] = useState(false);
  const mapRef = useRef<any>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      const L = (window as any).L;
      if (!leafletMap.current) {
        leafletMap.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([41.2995, 69.2401], 13); // Tashkent

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(leafletMap.current);
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      // Get current location (simulated or real)
      let lat = 41.2995;
      let lng = 69.2401;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-latest",
        contents: `Qidiruv: ${query}. Hozirgi koordinatalar: ${lat}, ${lng}. Menga ushbu joy haqida batafsil ma'lumot ber.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude: lat, longitude: lng }
            }
          }
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapResults = chunks.filter((c: any) => c.maps).map((c: any) => ({
        title: c.maps.title,
        uri: c.maps.uri,
        address: c.maps.address || "Manzil ma'lumoti yo'q",
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 500) + 50
      }));

      setResults(mapResults);
      if (mapResults.length > 0) {
        setSelectedPlace(mapResults[0]);
        setShowSheet(true);
      }
    } catch (err) {
      console.error("Map search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        leafletMap.current.setView([latitude, longitude], 15);
      });
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-black animate-ios">
      {/* Map View */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Floating Search Bar (Yandex Style) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20">
        <form onSubmit={handleSearch} className="glass-panel p-2 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all bg-[#141414]/80 backdrop-blur-xl">
          <div className="p-3 bg-white/5 rounded-full text-slate-400 group-focus-within:text-blue-400">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Joylarni qidirish (kafe, yoqilg'i...)"
            className="flex-1 bg-transparent border-none text-sm font-bold text-white placeholder-slate-500 outline-none"
          />
          <button className="p-3 hover:bg-white/10 rounded-full text-slate-500">
            <MoreHorizontal size={20} />
          </button>
        </form>

        {/* Quick Tags */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar snap-x no-scrollbar">
           {[
             { label: 'Yoqilg\'i', icon: Fuel, color: 'text-orange-400' },
             { label: 'Restoran', icon: Coffee, color: 'text-indigo-400' },
             { label: 'Turargoh', icon: ParkingCircle, color: 'text-emerald-400' },
             { label: 'Yana', icon: MapPin, color: 'text-slate-400' }
           ].map((tag, i) => (
             <button key={i} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full border border-white/10 text-[11px] font-bold text-white shrink-0 snap-start hover:bg-white/10 transition-colors">
               <tag.icon size={14} className={tag.color} />
               {tag.label}
             </button>
           ))}
        </div>
      </div>

      {/* Side Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
         <button onClick={handleLocate} className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all shadow-xl">
            <Locate size={22} />
         </button>
         <button className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all shadow-xl">
            <Compass size={22} className="text-blue-500" />
         </button>
      </div>

      {/* Bottom Information Sheet (iOS/Yandex Style) */}
      {selectedPlace && (
        <div className={`absolute bottom-0 left-0 right-0 z-30 transition-transform duration-700 var(--ios-spring) ${showSheet ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
           <div className="max-w-3xl mx-auto px-4 pb-4">
              <div className="glass-panel rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden bg-[#141414]/90 backdrop-blur-3xl">
                 {/* Drag Handle */}
                 <div className="flex justify-center p-3 cursor-pointer" onClick={() => setShowSheet(!showSheet)}>
                    <div className="w-10 h-1 bg-white/10 rounded-full" />
                 </div>

                 <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white">{selectedPlace.title}</h3>
                          <div className="flex items-center gap-4 text-xs font-bold">
                             <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={14} className="fill-current" />
                                <span>{selectedPlace.rating.toFixed(1)}</span>
                                <span className="text-slate-500">({selectedPlace.reviews})</span>
                             </div>
                             <div className="h-3 w-px bg-white/10" />
                             <span className="text-emerald-500">Hozir ochiq</span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
                             <Share2 size={20} />
                          </button>
                       </div>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                      {selectedPlace.address}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                       {[
                         { icon: Navigation, label: 'Marshrut', active: true },
                         { icon: Phone, label: 'Qo\'ng\'iroq' },
                         { icon: Globe, label: 'Sayt' },
                         { icon: Info, label: 'Batafsil' }
                       ].map((btn, i) => (
                         <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all active:scale-95 ${btn.active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                            <btn.icon size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{btn.label}</span>
                         </button>
                       ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Clock size={16} className="text-slate-500" />
                          <span className="text-xs text-slate-300 font-bold">Yo'lda 15 daqiqa (tirbandliksiz)</span>
                       </div>
                       <button className="flex items-center gap-2 text-xs font-bold text-blue-400 group">
                          Yo'llanma olish <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
           <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
           <p className="mt-6 text-[11px] font-bold text-white uppercase tracking-[0.5em] animate-pulse">Navigating Neural Path...</p>
        </div>
      )}
    </div>
  );
};
