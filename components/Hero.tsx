import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Navigation2, Search, Zap } from 'lucide-react';
import { RouteRequest } from '../types';

interface HeroProps {
  onSearch: (route: RouteRequest) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

// Expanded pool of images to mix rugged/wide and microcosm/hidden
const IMAGE_POOL = [
  // Wide / Rugged / Gigalithic
  { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop", type: "wide", label: "Untamed Horizons" },
  { url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2670&auto=format&fit=crop", type: "wide", label: "Silent Valleys" },
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2670&auto=format&fit=crop", type: "wide", label: "Coastal Edge" },
  { url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2676&auto=format&fit=crop", type: "wide", label: "Mountain Pass" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop", type: "wide", label: "The High Country" },
  { url: "https://images.unsplash.com/photo-1490659972355-613d038283a0?q=80&w=2670&auto=format&fit=crop", type: "wide", label: "Endless Road" },
  { url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2670&auto=format&fit=crop", type: "wide", label: "Red Rock Canyon" },
  
  // Microcosm / Cottage / Detail
  { url: "https://images.unsplash.com/photo-1542202229-21728e6aaa73?q=80&w=2670&auto=format&fit=crop", type: "detail", label: "Forest Floor" },
  { url: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop", type: "detail", label: "Ancient Canopy" },
  { url: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2670&auto=format&fit=crop", type: "detail", label: "Hidden Grove" },
  { url: "https://images.unsplash.com/photo-1504198266287-1659872e6590?q=80&w=2670&auto=format&fit=crop", type: "detail", label: "Morning Mist" },
  { url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2641&auto=format&fit=crop", type: "detail", label: "Quiet Woods" },
  { url: "https://images.unsplash.com/photo-1621849400072-f554417f7051?q=80&w=2532&auto=format&fit=crop", type: "detail", label: "Fern Valley" },
  { url: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=2574&auto=format&fit=crop", type: "detail", label: "Deep Roots" },
];

export const Hero: React.FC<HeroProps> = ({ onSearch, isLoading, isDarkMode }) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  
  // State for double buffering images to transition
  const [activeImage, setActiveImage] = useState(IMAGE_POOL[0]);
  const [nextImage, setNextImage] = useState(IMAGE_POOL[1]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [usedIndices, setUsedIndices] = useState<number[]>([0, 1]);

  // Pick a random next image ensuring no immediate repeats
  const cycleImage = () => {
    setIsTransitioning(true);
    
    // Wait for fade out to complete (CSS duration)
    setTimeout(() => {
      setActiveImage(nextImage);
      setIsTransitioning(false);
      
      // Select new next image
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * IMAGE_POOL.length);
      } while (usedIndices.includes(nextIdx));
      
      setNextImage(IMAGE_POOL[nextIdx]);
      setUsedIndices(prev => {
        const newIndices = [...prev, nextIdx];
        if (newIndices.length > 6) newIndices.shift(); // Keep history small
        return newIndices;
      });
    }, 1000); // Match CSS transition duration
  };

  useEffect(() => {
    const timer = setInterval(cycleImage, 8000); // 8 seconds per image
    return () => clearInterval(timer);
  }, [nextImage, usedIndices]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && destination) {
      onSearch({ start, destination });
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-900">
      
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Active Image (Bottom Layer) */}
        <div className="absolute inset-0">
           <img 
            src={activeImage.url} 
            alt="scenery" 
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>
        
        {/* Next Image (Top Layer - Fades In) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
           <img 
            src={activeImage.url} 
            alt="scenery" 
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Global Gradient Overlay */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
            isDarkMode 
              ? 'bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/80' 
              : 'bg-gradient-to-b from-stone-200/20 via-transparent to-stone-100/50'
          }`}></div>
        
        {/* Grain/Film Effect Specific to Hero */}
        <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Floating Scene Label */}
      <div className="absolute top-28 right-8 md:right-12 z-10 hidden md:flex flex-col items-end animate-fade-in text-right">
         <div className="flex items-center gap-3 mb-1">
            <span className="text-white/80 font-serif italic text-xl">{activeImage.label}</span>
            <div className="w-1.5 h-1.5 bg-clay-500 rounded-full animate-pulse"></div>
         </div>
         <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
           AI Scenery Gen • v2.5
         </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
        
        {/* Hero Typography */}
        <div className="text-center mb-16 space-y-2">
            <h1 className="text-6xl md:text-8xl lg:text-9xl text-white font-serif leading-[0.9] drop-shadow-2xl">
              <span className="block opacity-90">BEYOND THE</span>
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-br from-white via-stone-200 to-stone-500">
                TRAILHEAD
              </span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/80 max-w-xl mx-auto mt-6 leading-relaxed mix-blend-screen font-sans">
              Discover the spaces between the destinations. The quiet hollows, the jagged ridges, and the routes less taken.
            </p>
        </div>

        {/* REDESIGNED SEARCH: "Quartz Block" */}
        <div className="w-full max-w-3xl perspective-1000">
          <form 
            onSubmit={handleSubmit}
            className="quartz-glass p-3 rounded-2xl md:rounded-[20px] grid md:grid-cols-[1fr_auto_1fr_auto] gap-2 md:gap-0 shadow-2xl transition-all duration-500 hover:shadow-white/5"
          >
            {/* Start Input */}
            <div className="relative group md:border-r md:border-white/10 px-4">
               <label className="block text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 mt-2 pl-7">Begin Journey</label>
               <div className="flex items-center pb-2">
                  <Navigation2 className="w-4 h-4 text-white/60 absolute left-2 top-[22px]" />
                  <input 
                    type="text" 
                    placeholder="Portland, OR" 
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/30 pl-8 pr-4 py-1 border-none outline-none font-serif text-xl focus:ring-0"
                    required
                  />
               </div>
            </div>

            {/* Separator / Icon */}
            <div className="hidden md:flex items-center justify-center w-12 text-white/20">
              <div className="w-px h-8 bg-white/10"></div>
            </div>

            {/* End Input */}
            <div className="relative group px-4">
               <label className="block text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 mt-2 pl-7">Destination</label>
               <div className="flex items-center pb-2">
                  <MapPin className="w-4 h-4 text-white/60 absolute left-2 top-[22px]" />
                  <input 
                    type="text" 
                    placeholder="Joshua Tree, CA" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/30 pl-8 pr-4 py-1 border-none outline-none font-serif text-xl focus:ring-0"
                    required
                  />
               </div>
            </div>

            {/* Action Button - Geometric Block */}
            <button 
              type="submit"
              disabled={isLoading}
              className="md:ml-2 h-16 md:h-auto bg-white hover:bg-stone-200 text-stone-900 rounded-xl md:rounded-xl px-8 font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-white/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin" />
              ) : (
                <>
                  Find
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Status */}
        <div className="mt-12 flex items-center gap-6 opacity-60">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                <Zap className="w-3 h-3 text-clay-400" />
                Live Trail Data
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                Weather Sync Active
            </div>
        </div>
      </div>
    </div>
  );
};