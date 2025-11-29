import React, { useState } from 'react';
import { Sun, Moon, User, Tent, Mountain, Leaf } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [logoVariant, setLogoVariant] = useState(0);

  // Logo variations to "select from"
  const logos = [
    { icon: Mountain, text: "ONROUTE", sub: "OUTDOORS" },
    { icon: Tent, text: "NOMAD", sub: "TRAILS" },
    { icon: Leaf, text: "WILD", sub: "EARTH" },
  ];

  const CurrentLogo = logos[logoVariant];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Logo - Minimalist Glass */}
        <div 
          onClick={() => setLogoVariant((prev) => (prev + 1) % logos.length)}
          className="cursor-pointer flex items-center gap-3 group select-none"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-clay-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative p-2.5 border border-white/20 bg-white/5 backdrop-blur-md rounded-lg text-white group-hover:bg-white/10 transition-colors">
                <CurrentLogo.icon className="w-5 h-5" />
             </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-xl tracking-wide text-white drop-shadow-md">
              {CurrentLogo.text}
            </span>
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/70">
              {CurrentLogo.sub}
            </span>
          </div>
        </div>

        {/* Center Nav - Ultra Floating Glass Strip */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-2xl rounded-full px-1.5 py-1.5 border border-white/10 shadow-2xl">
          {['Route Planner', 'Journal', 'Gear List'].map((item, i) => (
            <a 
              key={item} 
              href="#" 
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                i === 0 
                  ? 'bg-white text-stone-900 shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions - Clean Circles */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/90 hover:bg-white/20 transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-sm">
            <User className="w-3 h-3" />
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};