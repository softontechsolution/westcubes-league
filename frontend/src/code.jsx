 {/* --- SECTION: MANAGE MATCHES LIST --- */}
        <div className="bg-card rounded-xl border border-gray-800 p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Select Match to Manage</h2>
          <div className="space-y-4">
            {matches.map(match => (
              <div key={match.id} className="bg-dark p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="font-bold text-white">{getTeamName(match.home_team_id)} vs {getTeamName(match.away_team_id)}</span>
                <button 
                  onClick={() => setSelectedMatch(match)}
                  className="bg-brand text-dark px-4 py-1.5 rounded text-sm font-bold hover:bg-emerald-400"
                >
                  Manage Match
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION: MANAGEMENT PANEL (Conditionally Rendered) --- */}
        {selectedMatch && (
          <div className="bg-card p-8 rounded-xl border border-brand/30 shadow-2xl animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Managing: {getTeamName(selectedMatch.home_team_id)} vs {getTeamName(selectedMatch.away_team_id)}</h2>
              <button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-white">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Goal Input Form */}
              <GoalForm 
                match={selectedMatch} 
                players={players.filter(p => p.team_id === selectedMatch.home_team_id || p.team_id === selectedMatch.away_team_id)}
                onSave={handleLogGoal}
              />

              {/* Score Override */}
              <div className="bg-dark p-6 rounded-lg border border-gray-800">
                <h3 className="text-brand font-bold mb-4">Manual Score Override</h3>
                <div className="flex gap-4">
                  <input type="number" value={selectedMatch.home_goals} onChange={(e) => handleUpdateMatch(selectedMatch.id, 'home_goals', parseInt(e.target.value))} className="w-full bg-card p-2 rounded border border-gray-700 text-white" />
                  <input type="number" value={selectedMatch.away_goals} onChange={(e) => handleUpdateMatch(selectedMatch.id, 'away_goals', parseInt(e.target.value))} className="w-full bg-card p-2 rounded border border-gray-700 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}


        {/* --- SECTION 2: MANAGE EXISTING MATCHES --- */}
      <div className="bg-card rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="bg-dark p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⚙️ Manage Scores & Status
          </h2>
        </div>
        
        <div className="divide-y divide-gray-800/50">
          {matches.length === 0 ? (
            <p className="p-8 text-center text-gray-500 font-semibold">No matches recorded yet.</p>
          ) : (
            matches.map(match => (
              <div key={match.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-800/30 transition-colors">
                
                {/* Teams & Score Inline Inputs */}
                <div className="flex-1 flex items-center justify-center gap-4 w-full">
                  <div className="flex-1 text-right font-bold text-gray-300">
                    {/* Using our helper to safely get the name from the ID */}
                    {match.home_team?.name || getTeamName(match.home_team_id)}
                  </div>
                  
                  <div className="flex items-center gap-3 bg-dark p-2.5 rounded-lg border border-gray-700 shadow-inner">
                    <input 
                      type="number" 
                      min="0"
                      value={match.home_goals}
                      onChange={(e) => handleUpdateMatch(match.id, 'home_goals', parseInt(e.target.value) || 0)}
                      className="w-14 bg-card border border-gray-700 rounded text-center text-xl font-bold text-white focus:outline-none focus:border-brand py-1"
                    />
                    <span className="text-gray-500 font-bold">:</span>
                    <input 
                      type="number" 
                      min="0"
                      value={match.away_goals}
                      onChange={(e) => handleUpdateMatch(match.id, 'away_goals', parseInt(e.target.value) || 0)}
                      className="w-14 bg-card border border-gray-700 rounded text-center text-xl font-bold text-white focus:outline-none focus:border-brand py-1"
                    />
                  </div>

                  <div className="flex-1 text-left font-bold text-gray-300">
                    {match.away_team?.name || getTeamName(match.away_team_id)}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="w-full md:w-48">
                  <select 
                    value={match.status || 'Finished'}
                    onChange={(e) => handleUpdateMatch(match.id, 'status', e.target.value)}
                    className={`w-full text-sm font-bold border rounded-lg py-2.5 px-3 outline-none appearance-none text-center cursor-pointer transition-colors
                      ${match.status === 'Live' ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' : 
                        match.status === 'Finished' ? 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700' : 
                        'bg-brand/10 text-brand border-brand/30 hover:bg-brand/20'}`}
                  >
                    <option value="Scheduled" className="bg-dark text-white">Scheduled</option>
                    <option value="Live" className="bg-dark text-white">Live</option>
                    <option value="Finished" className="bg-dark text-white">Finished</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>