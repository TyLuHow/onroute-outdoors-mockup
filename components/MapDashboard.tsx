import React, { useState } from 'react';
import { RouteRequest, Trail } from '../types';
import { 
  ArrowLeft, Sliders, Map as MapIcon, Layers, 
  Navigation, Star, Clock, CloudSun, Mountain, Trees
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface MapDashboardProps {
  route: RouteRequest;
  trails: Trail[];
  onBack: () => void;
}

// Mock elevation data
const mockElevationData = [
  { h: 200 }, { h: 350 }, { h: 300 }, { h: 550 }, { h: 700 }, { h: 650 }, { h: 800 }, { h: 400 }
];

export const MapDashboard: React.FC<MapDashboardProps> = ({ route, trails, onBack }) => {
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(trails[0]?.id || null);

  const selectedTrail = trails.find(t => t.id === selectedTrailId) || trails[0];

  return (
    <div className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden bg-stone-100 dark:bg-stone-900 transition-colors duration-500">
      
      {/* MAP BACKGROUND */}
      <div className="absolute inset-0 z-0">
         {/* Use a map style that fits earthy tones */}
        <div className="w-full h-full bg-[#e5e0d8] dark:bg-[#1a1816] transition-colors duration-500 relative overflow-hidden">
             {/* Abstract Map Lines */}
             <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-500"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
             </svg>
             
             {/* Simulated Route */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-clay-600 dark:stroke-clay-500" style={{strokeDasharray: '12,8'}}>
                <path 
                    d="M 200 800 Q 450 650 600 500 T 1100 250" 
                    fill="none" 
                    strokeWidth="6" 
                    className="drop-shadow-lg"
                />
                <circle cx="200" cy="800" r="8" className="fill-stone-800 dark:fill-stone-200" />
                <circle cx="1100" cy="250" r="8" className="fill-stone-800 dark:fill-stone-200" />
             </svg>
        </div>
      </div>

      {/* LEFT SIDEBAR: Controls & List */}
      <div className="relative z-10 w-full md:w-[500px] h-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-r border-stone-200 dark:border-stone-800 flex flex-col shadow-2xl transition-colors duration-500">
        
        {/* Header */}
        <div className="p-8 pb-4">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-stone-500 hover:text-clay-600 dark:text-stone-400 dark:hover:text-clay-400 mb-6 text-sm font-bold tracking-wide uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </button>
          
          <h1 className="font-serif text-4xl text-stone-900 dark:text-stone-100 leading-none mb-1">
            {route.destination}
          </h1>
          <div className="flex items-center gap-2 text-clay-600 dark:text-clay-500 font-medium italic">
            <span className="w-8 h-[1px] bg-current"></span>
            From {route.start}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-stone-100 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/50">
              <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Distance</div>
              <div className="text-stone-800 dark:text-stone-100 font-condensed font-bold text-2xl">284 <span className="text-sm font-normal text-stone-500">miles</span></div>
            </div>
            <div className="bg-stone-100 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/50">
              <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider mb-1">Est. Time</div>
              <div className="text-stone-800 dark:text-stone-100 font-condensed font-bold text-2xl">4h <span className="text-sm font-normal text-stone-500">23m</span></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold whitespace-nowrap shadow-md">
            <Trees className="w-3 h-3" />
            All Trails
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:border-clay-500 hover:text-clay-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 transition-colors text-xs font-bold whitespace-nowrap">
            Difficulty
          </button>
          <button className="px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:border-clay-500 hover:text-clay-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 transition-colors text-xs font-bold whitespace-nowrap">
            Elevation Gain
          </button>
        </div>

        {/* Trail List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
          <div className="flex items-center gap-4 py-2">
             <div className="h-[1px] flex-1 bg-stone-200 dark:bg-stone-800"></div>
             <span className="text-xs font-serif italic text-stone-400">Curated Stops</span>
             <div className="h-[1px] flex-1 bg-stone-200 dark:bg-stone-800"></div>
          </div>
          
          {trails.map((trail) => (
            <div 
              key={trail.id}
              onClick={() => setSelectedTrailId(trail.id)}
              className={`relative p-5 rounded-3xl cursor-pointer transition-all duration-300 group overflow-hidden ${
                selectedTrailId === trail.id 
                  ? 'bg-stone-900 text-white shadow-xl scale-[1.02] z-10 dark:bg-stone-100 dark:text-stone-900' 
                  : 'bg-white hover:bg-stone-50 text-stone-900 border border-stone-100 shadow-sm dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700'
              }`}
            >
              {/* Active Indicator Strip */}
              {selectedTrailId === trail.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-clay-500"></div>
              )}

              <div className="flex justify-between items-start mb-1 pl-2">
                <h3 className="font-serif font-bold text-xl">{trail.name}</h3>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    selectedTrailId === trail.id ? 'bg-white/20 text-white dark:bg-black/10 dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
                }`}>
                  <Star className="w-3 h-3 fill-current" />
                  {trail.rating}
                </div>
              </div>
              
              <p className={`text-sm mb-4 line-clamp-2 pl-2 ${
                  selectedTrailId === trail.id ? 'text-white/70 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'
              }`}>
                {trail.description}
              </p>

              <div className="flex items-center gap-3 text-xs pl-2 font-medium tracking-wide">
                <span className={`uppercase ${
                  trail.difficulty === 'Hard' ? 'text-red-500' : 
                  trail.difficulty === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'
                } ${selectedTrailId === trail.id ? 'brightness-125' : ''}`}>
                  {trail.difficulty}
                </span>
                <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                <span className="flex items-center gap-1 opacity-80">
                  <Clock className="w-3 h-3" />
                  {trail.duration}
                </span>
                <span className="w-1 h-1 rounded-full bg-current opacity-30"></span>
                <span className="opacity-80">{trail.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Map Area & Floating Detail Card */}
      <div className="relative flex-1 h-full hidden md:block">
        
        {/* Floating Controls */}
        <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
          <button className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-clay-600 hover:scale-105 transition-all shadow-xl border border-stone-200 dark:border-stone-700">
            <Layers className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-clay-600 hover:scale-105 transition-all shadow-xl border border-stone-200 dark:border-stone-700">
            <MapIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Trail Detail Overlay (Bottom) */}
        {selectedTrail && (
          <div className="absolute bottom-10 left-10 right-10 z-20">
            <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-[2rem] p-8 border border-stone-200 dark:border-stone-700/50 shadow-2xl flex gap-10 items-end transform transition-all animate-fade-in-up">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-clay-600 dark:text-clay-500 text-xs font-bold uppercase tracking-widest">
                  <CloudSun className="w-4 h-4" />
                  Perfect Conditions • 65°F
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-stone-900 dark:text-stone-100 mb-4">{selectedTrail.name}</h2>
                <div className="text-stone-600 dark:text-stone-400 mb-8 max-w-xl text-lg leading-relaxed">
                    {selectedTrail.description}
                </div>
                
                <div className="flex gap-4">
                   <button className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white px-8 py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Start Navigation
                  </button>
                  <button className="bg-transparent border-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:border-stone-900 dark:hover:border-stone-100 px-8 py-4 rounded-xl font-bold tracking-wide transition-all">
                    Save to List
                  </button>
                </div>
              </div>

              {/* Mini Elevation Chart */}
              <div className="w-80 h-40 hidden lg:block bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-700/50">
                 <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Elevation Profile</div>
                    <div className="text-[10px] text-clay-500 font-bold">+1,204 ft</div>
                 </div>
                 <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={mockElevationData}>
                      <defs>
                        <linearGradient id="colorH" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="h" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorH)" />
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

        {/* Mock Map Markers */}
        <div className="absolute top-[35%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
           <div className="relative">
              <div className="w-16 h-16 bg-clay-500/20 rounded-full animate-ping absolute inset-0"></div>
              <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-full shadow-2xl flex items-center justify-center relative z-10 border-4 border-white dark:border-stone-700 transition-transform group-hover:scale-110">
                  <Mountain className="w-8 h-8 text-stone-800 dark:text-white" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};