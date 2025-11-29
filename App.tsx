import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MapDashboard } from './components/MapDashboard';
import { RouteRequest, Trail, AppState } from './types';
import { findTrailsAlongRoute } from './services/geminiService';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [state, setState] = useState<AppState>({
    view: 'home',
    route: null,
    trails: [],
    loading: false,
    selectedTrail: null
  });

  // Toggle Tailwind dark mode class on body/html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = async (routeRequest: RouteRequest) => {
    setState(prev => ({ ...prev, loading: true }));
    
    // Call Gemini Service
    const trails = await findTrailsAlongRoute(routeRequest.start, routeRequest.destination);
    
    setState({
      view: 'map',
      route: routeRequest,
      trails: trails,
      loading: false,
      selectedTrail: trails.length > 0 ? trails[0] : null
    });
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, view: 'home', route: null }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-500`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      
      <main>
        {state.view === 'home' ? (
          <Hero onSearch={handleSearch} isLoading={state.loading} isDarkMode={isDarkMode} />
        ) : (
          state.route && (
            <MapDashboard 
              route={state.route} 
              trails={state.trails} 
              onBack={handleBack}
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;