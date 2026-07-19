import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Standings from './pages/Standings';
import Matches from './pages/Matches';
import Players from './pages/Players';
import Dashboard from './pages/Dashboard';
import TeamDetails from './pages/TeamDetails';

function App() {
  // Global simulation flag state to switch between public guest and admin control schemas
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-dark text-white">
        
        {/* PREMIUM NAVIGATION BAR */}
        <nav className="bg-card border-b border-gray-800 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center font-bold text-dark">
                  W
                </div>
                <span className="font-bold text-xl tracking-wider text-white">
                  WESTCUBES PL
                </span>
              </div>
              
              {/* Desktop Menu - Dynamically updates based on authorization state */}
              <div className="hidden md:flex items-center space-x-6">
                {isAdmin ? (
                  <>
                    {/* ADMIN MENU LINKS */}
                    <Link to="/" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                    <Link to="/teams" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Manage Teams</Link>
                    <Link to="/matches" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Record Match</Link>
                    <Link to="/players" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Add Players</Link>
                    <Link to="/standings" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Standings</Link>
                    <Link to="/dashboard" className="text-brand bg-brand/5 border border-brand/20 hover:bg-brand/10 px-3 py-1.5 rounded-md text-sm font-bold transition-all">
                      👁️ Preview Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    {/* GUEST PUBLIC MENU LINKS */}
                    <Link to="/" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Match Center</Link>
                    <Link to="/standings" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">League Table</Link>
                  </>
                )}

                {/* VISUAL DEV SIMULATOR BUTTON */}
                <button 
                  onClick={() => setIsAdmin(!isAdmin)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all shadow-sm ${
                    isAdmin 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' 
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {isAdmin ? '🔒 Logout Admin' : '🔑 Simulate Admin'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* 
              DYNAMIC HOME ROUTE: 
              If admin is logged in, the base URL opens the data modification management hub (Home.jsx).
              If a guest visits, the base URL transparently loads the Match Center (Dashboard.jsx).
            */}
            <Route path="/" element={isAdmin ? <Home /> : <Dashboard />} />
            
            {/* Publicly Open Display Routes */}
            <Route path="/standings" element={<Standings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams/:team_id" element={<TeamDetails />} />

            {/* 
              GUARDED ACTION PATHWAYS:
              Ternary checks block deep link URL tampering. Unauthenticated users are bounced out.
            */}
            <Route path="/teams" element={isAdmin ? <Teams /> : <Navigate to="/" replace />} />
            <Route path="/matches" element={isAdmin ? <Matches /> : <Navigate to="/" replace />} />
            <Route path="/players" element={isAdmin ? <Players /> : <Navigate to="/" replace />} />
            
            {/* Global Wildcard Fallback Bounce */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;