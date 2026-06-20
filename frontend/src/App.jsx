import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Teams from './pages/Teams';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        
        {/* PREMIUM NAVIGATION BAR */}
        <nav className="bg-card border-b border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                {/* A simple placeholder logo */}
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center font-bold text-dark">
                  W
                </div>
                <span className="font-bold text-xl tracking-wider text-white">
                  WESTCUBES PL
                </span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-6">
                  <Link to="/" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                  <Link to="/teams" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Manage Teams</Link>
                  <Link to="/standings" className="hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors">Standings</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            {/* We will build the Standings component later */}
            <Route path="/standings" element={<div className="text-center mt-20 text-gray-400">Standings coming soon...</div>} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;