import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function TeamDetails() {
  const { team_id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamMap, setTeamMap] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch ALL teams to create our look-up map
        const teamsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/teams/`,
        );
        const allTeams = await teamsRes.json();

        // Create a Hash Map: { 1: "Lions", 2: "Tigers" }
        const map = {};
        allTeams.forEach((t) => (map[t.id] = t.name));
        setTeamMap(map);

        // Find current team
        const currentTeam = allTeams.find((t) => t.id === parseInt(team_id));
        setTeam(currentTeam);

        // 2. Fetch Players
        const playersRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/teams/${team_id}/players/`,
        );
        const playersData = await playersRes.json();
        setPlayers(playersData);

        // 3. Fetch Matches
        const matchesRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/teams/${team_id}/matches/`,
        );
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, [team_id]);

  if (!team)
    return (
      <div className="text-white text-center py-20">
        Loading team profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {team.name}
        </h1>
        <p className="text-gray-400 font-medium mt-1">
          Managed by {team.manager_name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Squad List */}
        <section className="bg-card p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Squad</h2>
          {players.length === 0 ? (
            <p className="text-gray-500">No players yet.</p>
          ) : (
            <table className="w-full">
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/50">
                    <td className="py-2 text-brand font-mono">
                      #{p.squad_number}
                    </td>
                    <td className="py-2 text-white">{p.name}</td>
                    <td className="py-2 text-gray-500 text-sm">{p.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Match History */}
        <section className="bg-card p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Match History</h2>
          {matches.length === 0 ? (
            <p className="text-gray-500">No matches recorded.</p>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                // Determine which ID is the opponent
                const opponentId =
                  m.home_team_id === team.id ? m.away_team_id : m.home_team_id;
                // Look up the name in our map
                const opponentName = teamMap[opponentId] || "Unknown Team";

                return (
                  <div
                    key={m.id}
                    className="flex justify-between items-center bg-dark p-3 rounded-lg border border-gray-800"
                  >
                    <span className="text-white font-medium">
                      vs {opponentName}
                    </span>
                    <span className="text-xl font-bold text-brand">
                      {m.home_goals} - {m.away_goals}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
