import { useState, useEffect } from 'react';

export default function Matches() {
  // =====================================================================
  // 1. COMPONENT STATE
  // Holding our teams for the dropdowns, and the form data for submission
  // =====================================================================
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    home_team_id: '',
    away_team_id: '',
    home_goals: 0,
    away_goals: 0
  });
  const [statusMessage, setStatusMessage] = useState('');

  // =====================================================================
  // 2. FETCH TEAMS ON LOAD
  // We need the real database IDs to attach to the match
  // =====================================================================
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:8000/teams/');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error('Failed to load teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // =====================================================================
  // 3. HANDLE INPUT CHANGES
  // Standardizing data types before they hit state
  // =====================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    // We parse integers here because HTML inputs return strings by default,
    // and our Python backend strictly requires integers (Pydantic models).
    setFormData({ 
      ...formData, 
      [name]: name.includes('id') || name.includes('goals') ? parseInt(value) || 0 : value 
    });
  };

  // =====================================================================
  // 4. SUBMIT MATCH TO BACKEND
  // =====================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Recording match...');

    // Frontend validation: Prevent teams from playing themselves
    if (formData.home_team_id === formData.away_team_id) {
      setStatusMessage('Error: A team cannot play against itself!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/matches/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage('Match recorded successfully! 🏆');
        // Reset goals, but keep the teams selected for rapid data entry
        setFormData({ ...formData, home_goals: 0, away_goals: 0 });
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setStatusMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Match Center</h1>
        <p className="text-gray-400 mt-1">Record official league results.</p>
      </div>

      <div className="bg-card p-8 rounded-xl border border-gray-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* TEAM SELECTION ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Team */}
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold uppercase tracking-wider">Home Team</label>
              <select 
                name="home_team_id"
                value={formData.home_team_id}
                onChange={handleChange}
                required
                className="w-full bg-dark text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-brand"
              >
                <option value="" disabled>Select Home Team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Away Team */}
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold uppercase tracking-wider">Away Team</label>
              <select 
                name="away_team_id"
                value={formData.away_team_id}
                onChange={handleChange}
                required
                className="w-full bg-dark text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-brand"
              >
                <option value="" disabled>Select Away Team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SCORE INPUT ROW */}
          <div className="flex items-center justify-center space-x-6 bg-dark p-6 rounded-lg border border-gray-800">
            <div className="text-center">
              <label className="block text-brand text-xs font-bold uppercase mb-2">Home Goals</label>
              <input 
                type="number" 
                name="home_goals"
                min="0"
                value={formData.home_goals}
                onChange={handleChange}
                required
                className="w-20 text-center bg-card text-3xl font-bold text-white border border-gray-700 rounded-lg py-2 focus:outline-none focus:border-brand"
              />
            </div>
            
            <div className="text-gray-500 font-bold text-xl">VS</div>

            <div className="text-center">
              <label className="block text-brand text-xs font-bold uppercase mb-2">Away Goals</label>
              <input 
                type="number" 
                name="away_goals"
                min="0"
                value={formData.away_goals}
                onChange={handleChange}
                required
                className="w-20 text-center bg-card text-3xl font-bold text-white border border-gray-700 rounded-lg py-2 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand hover:bg-emerald-400 text-dark text-lg font-bold py-3 rounded-lg transition-colors shadow-lg shadow-brand/20"
          >
            Submit Final Score
          </button>

          {statusMessage && (
            <div className={`p-4 rounded-lg text-center font-semibold ${statusMessage.includes('Error') ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'}`}>
              {statusMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}