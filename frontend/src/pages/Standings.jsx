import { useState, useEffect } from 'react';

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch('http://localhost:8000/standings/');
        if (response.ok) {
          const teams = await response.json();
          
          setStandings(teams);
        }
      } catch (error) {
        console.error('Error connecting to API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">League Table</h1>
          <p className="text-gray-400 mt-1">Westcubes Premier Football League</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading standings...</div>
      ) : standings.length === 0 ? (
        <div className="bg-card p-8 rounded-xl border border-gray-800 text-center shadow-md">
          <p className="text-gray-400 text-lg">No teams in the league yet.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-700">
                  <th className="p-4 font-semibold w-16 text-center">Pos</th>
                  <th className="p-4 font-semibold">Club</th>
                  <th className="p-4 font-semibold text-center" title="Matches Played">MP</th>
                  <th className="p-4 font-semibold text-center" title="Won">W</th>
                  <th className="p-4 font-semibold text-center" title="Drawn">D</th>
                  <th className="p-4 font-semibold text-center" title="Lost">L</th>
                  <th className="p-4 font-semibold text-center hidden sm:table-cell" title="Goals For">GF</th>
                  <th className="p-4 font-semibold text-center hidden sm:table-cell" title="Goals Against">GA</th>
                  <th className="p-4 font-semibold text-center hidden sm:table-cell" title="Goal Difference">GD</th>
                  <th className="p-4 font-bold text-brand text-center text-lg" title="Points">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {standings.map((team, index) => (
                  <tr 
                    key={team.id} 
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="p-4 text-center font-bold text-gray-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </td>
                    <td className="p-4 font-medium text-white flex items-center space-x-3">
                      <div className="w-6 h-6 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center font-bold text-brand text-xs">
                        {team.name.substring(0, 1).toUpperCase()}
                      </div>
                      <span>{team.name}</span>
                    </td>
                    <td className="p-4 text-center text-gray-300">{team.played}</td>
                    <td className="p-4 text-center text-gray-300">{team.won}</td>
                    <td className="p-4 text-center text-gray-300">{team.drawn}</td>
                    <td className="p-4 text-center text-gray-300">{team.lost}</td>
                    <td className="p-4 text-center text-gray-400 hidden sm:table-cell">{team.goalsFor}</td>
                    <td className="p-4 text-center text-gray-400 hidden sm:table-cell">{team.goalsAgainst}</td>
                    <td className="p-4 text-center text-gray-400 hidden sm:table-cell">{team.goalDifference}</td>
                    <td className="p-4 text-center font-bold text-white text-lg">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}