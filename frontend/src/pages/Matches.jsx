import { useState, useEffect } from "react";

// --- NEW COMPONENT: GOAL LOGGING MODAL ---
const LogGoalModal = ({ match, onClose, players, onSave }) => {
  const [goalData, setGoalData] = useState({
    scorer_id: "",
    assist_id: "",
    minute: "",
    team_id: "",
  });

  const relevantPlayers = players.filter((p) => p.team_id == goalData.team_id);

  if (!match) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-md rounded-xl p-6 border border-gray-700">
        <h3 className="text-white font-bold text-lg mb-4">
          Log Goal: {match.home_team?.name} vs {match.away_team?.name}
        </h3>

        <select
          className="w-full bg-dark p-2 mb-3 rounded"
          onChange={(e) =>
            setGoalData({ ...goalData, team_id: e.target.value })
          }
        >
          <option value="">Select Scoring Team</option>
          <option value={match.home_team_id}>{match.home_team?.name}</option>
          <option value={match.away_team_id}>{match.away_team?.name}</option>
        </select>

        <select
          className="w-full bg-dark p-2 mb-3 rounded"
          onChange={(e) =>
            setGoalData({ ...goalData, scorer_id: e.target.value })
          }
        >
          <option value="">Select Scorer</option>
          {relevantPlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="w-full bg-dark p-2 mb-3 rounded"
          onChange={(e) =>
            setGoalData({ ...goalData, assist_id: e.target.value })
          }
        >
          <option value="">Select Assist (Optional)</option>
          {relevantPlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Minute"
          className="w-full bg-dark p-2 mb-4 rounded"
          onChange={(e) => setGoalData({ ...goalData, minute: e.target.value })}
        />

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-gray-600 p-2 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(goalData)}
            className="flex-1 bg-brand p-2 rounded text-dark font-bold"
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Matches() {
  // =====================================================================
  // 1. COMPONENT STATE
  // Holding teams, matches list, and form data for new match submission
  // =====================================================================
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]); // NEW: Store existing matches
  const [statusMessage, setStatusMessage] = useState("");
  const [players, setPlayers] = useState([]); // NEW: State for players
  // Controls which match is currently being managed
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [goals, setGoals] = useState([]);

  const [formData, setFormData] = useState({
    home_team_id: "",
    away_team_id: "",
    home_goals: 0,
    away_goals: 0,
    match_date: "", // NEW: Holds the scheduled date and time
  });

  // =====================================================================
  // 2. FETCH DATA ON LOAD (Teams & Matches)
  // =====================================================================
  const fetchData = async () => {
    try {
      // Keep your existing matches/teams/players fetch requests here...
      const matchesRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/matches/`,
      );
      const teamsRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/teams/`,
      );
      const playersRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/players/`,
      );
      const goalsRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/`,
      ); // NEW FETCH

      if (matchesRes.ok && teamsRes.ok && playersRes.ok && goalsRes.ok) {
        setMatches(await matchesRes.json());
        setTeams(await teamsRes.json());
        setPlayers(await playersRes.json());
        setGoals(await goalsRes.json()); // SAVE GOALS TO STATE
        console.log("DEBUG: Data loaded successfully.");
      }
    } catch (error) {
      console.error("DEBUG: Failed to load application data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================================
  // 3. GOAL LOGGING LOGIC
  // =====================================================================
  const handleLogGoal = async (goalData) => {
    console.log("DEBUG: Submitting goal...", goalData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(goalData),
        },
      );
      if (response.ok) {
        setStatusMessage("Goal recorded! Score updated.");
        fetchData(); // Refresh to show new score
      }
    } catch (error) {
      console.error("DEBUG: Goal logging failed", error);
    }
  };
  // =====================================================================
  // 4. HANDLE INPUT CHANGES (For New Match Form)
  // =====================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name.includes("id") || name.includes("goals")
          ? parseInt(value) || 0
          : value,
    });
  };

  // =====================================================================
  // 5. SUBMIT NEW MATCH (POST)
  // =====================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("Recording match...");

    if (formData.home_team_id === formData.away_team_id) {
      setStatusMessage("Error: A team cannot play against itself!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/matches/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        setStatusMessage("Match recorded successfully! 🏆");
        setFormData({ ...formData, home_goals: 0, away_goals: 0 });
        fetchData(); // NEW: Refresh the matches list instantly
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setStatusMessage("Failed to connect to the server.");
    }
  };

  // =====================================================================
  // 6. UPDATE EXISTING MATCH (PATCH)
  // Real-time inline editing for goals and status
  // =====================================================================
  const handleUpdateMatch = async (id, field, value) => {
    console.log(
      `DEBUG: Updating match ${id} | Field: ${field} | Value: ${value}`,
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/matches/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        },
      );

      if (response.ok) {
        console.log("DEBUG: Update successful.");
        fetchData(); // Refresh UI
      } else {
        const errorData = await response.json();
        console.error("DEBUG: Update failed with response:", errorData);
        setStatusMessage(
          `Update Failed: ${errorData.detail || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("DEBUG: Network error on PATCH:", error);
      setStatusMessage("Connection error. Could not update match.");
    }
  };

  const handleUpdateGoal = async (goalId, updatedFields) => {
    console.log(`DEBUG: Updating Goal ID ${goalId}`, updatedFields);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/${goalId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        },
      );
      if (response.ok) {
        setStatusMessage("Goal event updated successfully.");
        fetchData(); // Triggers real-time score/event refresh
      }
    } catch (error) {
      console.error("DEBUG: Failed to patch goal event", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    console.log(`DEBUG: Deleting/Reverting Goal ID ${goalId}`);
    if (
      !window.confirm(
        "Disallow this goal? The match score will automatically decrement.",
      )
    )
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/goals/${goalId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setStatusMessage("Goal removed. Score adjusted.");
        fetchData(); // Dynamic live refresh
      }
    } catch (error) {
      console.error("DEBUG: Failed to delete goal event", error);
    }
  };

  // Helper function to safely get team names from IDs
  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Match Center
        </h1>
        <p className="text-gray-400 mt-1">
          Record new matches and manage live scores.
        </p>
      </div>

      {/* --- SECTION 1: CREATE NEW MATCH --- */}
      <div className="bg-card p-8 rounded-xl border border-gray-800 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          ➕ Create New Match
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold uppercase tracking-wider">
                Home Team
              </label>
              <select
                name="home_team_id"
                value={formData.home_team_id}
                onChange={handleChange}
                required
                className="w-full bg-dark text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-brand"
              >
                <option value="" disabled>
                  Select Home Team...
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-400 text-sm font-bold uppercase tracking-wider">
                Away Team
              </label>
              <select
                name="away_team_id"
                value={formData.away_team_id}
                onChange={handleChange}
                required
                className="w-full bg-dark text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-brand"
              >
                <option value="" disabled>
                  Select Away Team...
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* --- NEW: DATE & TIME ROW --- */}
          <div className="bg-dark p-6 rounded-lg border border-gray-800">
            <label className="block text-brand text-xs font-bold uppercase mb-2 text-center">
              📅 Schedule Match Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              name="match_date"
              value={formData.match_date}
              onChange={handleChange}
              className="w-full bg-card text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-brand text-center"
            />
            <p className="text-gray-500 text-xs text-center mt-2">
              Leave blank if the match is already played. Set a future date to
              schedule a fixture.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-6 bg-dark p-6 rounded-lg border border-gray-800">
            <div className="text-center">
              <label className="block text-brand text-xs font-bold uppercase mb-2">
                Home Goals
              </label>
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
              <label className="block text-brand text-xs font-bold uppercase mb-2">
                Away Goals
              </label>
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
            Submit Match
          </button>

          {statusMessage && (
            <div
              className={`p-4 rounded-lg text-center font-semibold ${statusMessage.includes("Error") ? "bg-red-900/30 text-red-400 border border-red-800" : "bg-emerald-900/30 text-emerald-400 border border-emerald-800"}`}
            >
              {statusMessage}
            </div>
          )}
        </form>
      </div>

      {/* --- SECTION 2: MANAGE EXISTING MATCHES --- */}
      <div className="bg-card rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="bg-dark p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⚙️ Manage Scores & Status
          </h2>
        </div>

        <div className="divide-y divide-gray-800/50">
          {matches.length === 0 ? (
            <p className="p-8 text-center text-gray-500 font-semibold">
              No matches recorded yet.
            </p>
          ) : (
            matches.map((match) => (
              <MatchManagementRow
                key={match.id}
                match={match}
                teams={teams}
                players={players}
                goals={goals} // NEW
                getTeamName={getTeamName}
                handleUpdateMatch={handleUpdateMatch}
                handleLogGoal={handleLogGoal}
                handleUpdateGoal={handleUpdateGoal} // NEW
                handleDeleteGoal={handleDeleteGoal} // NEW
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean logic
const GoalForm = ({ match, players, onSave }) => {
  const [data, setData] = useState({
    scorer_id: "",
    assist_id: "",
    minute: "",
    team_id: "",
  });

  return (
    <div className="space-y-4">
      <h3 className="text-brand font-bold">Log Event</h3>
      <select
        className="w-full bg-dark p-2 rounded text-white"
        onChange={(e) => setData({ ...data, team_id: e.target.value })}
      >
        <option value="">Select Team</option>
        <option value={match.home_team_id}>
          {match.home_team?.name || "Home"}
        </option>
        <option value={match.away_team_id}>
          {match.away_team?.name || "Away"}
        </option>
      </select>

      <select
        className="w-full bg-dark p-2 rounded text-white"
        onChange={(e) => setData({ ...data, scorer_id: e.target.value })}
      >
        <option value="">Scorer</option>
        {players
          .filter((p) => p.team_id == data.team_id)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>

      <select
        className="w-full bg-dark p-2 rounded text-white"
        onChange={(e) => setData({ ...data, assist_id: e.target.value })}
      >
        <option value="">Assist (Optional)</option>
        {players
          .filter((p) => p.team_id == data.team_id)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>

      <input
        type="number"
        placeholder="Minute"
        className="w-full bg-dark p-2 rounded text-white"
        onChange={(e) => setData({ ...data, minute: e.target.value })}
      />

      <button
        onClick={() => onSave({ ...data, match_id: match.id })}
        className="w-full bg-brand p-3 rounded font-bold text-dark"
      >
        Log Goal
      </button>
    </div>
  );
};

// =====================================================================
// INLINE MATCH MANAGEMENT ROW SUB-COMPONENT
// =====================================================================
const MatchManagementRow = ({
  match,
  teams,
  players,
  goals,
  getTeamName,
  handleUpdateMatch,
  handleLogGoal,
  handleUpdateGoal,
  handleDeleteGoal,
}) => {
  const [inlineGoal, setInlineGoal] = useState({
    scorer_id: "",
    assist_id: "",
    minute: "",
    team_id: "",
  });

  // State to track which goal ID is currently being modified inline
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editForm, setEditForm] = useState({
    scorer_id: "",
    assist_id: "",
    minute: "",
  });

  const safePlayers = Array.isArray(players) ? players : [];
  const safeGoals = Array.isArray(goals) ? goals : [];

  // Filter players and match specific goals
  const matchPlayers = safePlayers.filter(
    (p) => p.team_id === match.home_team_id || p.team_id === match.away_team_id,
  );
  const activeMatchGoals = safeGoals
    .filter((g) => g.match_id === match.id)
    .sort((a, b) => a.minute - b.minute);

  const getPlayerName = (id) =>
    safePlayers.find((p) => p.id === id)?.name || `Unknown Player (${id})`;

  const submitInlineGoal = () => {
    if (!inlineGoal.scorer_id || !inlineGoal.minute || !inlineGoal.team_id) {
      alert(
        "Please select a Team, Scorer, and enter the Minute to log the goal.",
      );
      return;
    }
    handleLogGoal({
      match_id: match.id,
      team_id: parseInt(inlineGoal.team_id),
      scorer_id: parseInt(inlineGoal.scorer_id),
      assist_id: inlineGoal.assist_id ? parseInt(inlineGoal.assist_id) : null,
      minute: parseInt(inlineGoal.minute),
    });
    setInlineGoal({ scorer_id: "", assist_id: "", minute: "", team_id: "" });
  };

  const saveGoalEdit = (goalId) => {
    handleUpdateGoal(goalId, {
      scorer_id: parseInt(editForm.scorer_id),
      assist_id: editForm.assist_id ? parseInt(editForm.assist_id) : null,
      minute: parseInt(editForm.minute),
    });
    setEditingGoalId(null);
  };

  return (
    <div className="p-6 flex flex-col gap-4 hover:bg-gray-800/30 transition-colors">
      {/* ROW LAYER 1: Core Controls (Your exact design) */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 w-full">
        {/* Score Inputs */}
        <div className="flex-1 flex items-center justify-center gap-4 w-full">
          <div className="flex-1 text-right font-bold text-gray-300">
            {match.home_team?.name || getTeamName(match.home_team_id)}
          </div>
          <div className="flex items-center gap-3 bg-dark p-2.5 rounded-lg border border-gray-700 shadow-inner">
            <input
              type="number"
              min="0"
              value={match.home_goals}
              onChange={(e) =>
                handleUpdateMatch(
                  match.id,
                  "home_goals",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-14 bg-card border border-gray-700 rounded text-center text-xl font-bold text-white py-1"
            />
            <span className="text-gray-500 font-bold">:</span>
            <input
              type="number"
              min="0"
              value={match.away_goals}
              onChange={(e) =>
                handleUpdateMatch(
                  match.id,
                  "away_goals",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-14 bg-card border border-gray-700 rounded text-center text-xl font-bold text-white py-1"
            />
          </div>
          <div className="flex-1 text-left font-bold text-gray-300">
            {match.away_team?.name || getTeamName(match.away_team_id)}
          </div>
        </div>

        {/* Inline Goal Addition Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center bg-dark/40 p-3 rounded-lg border border-gray-800/80">
          <select
            value={inlineGoal.team_id}
            onChange={(e) =>
              setInlineGoal({
                ...inlineGoal,
                team_id: e.target.value,
                scorer_id: "",
                assist_id: "",
              })
            }
            className="bg-card text-white text-xs border border-gray-700 rounded-lg py-2 px-2 w-32"
          >
            <option value="">Select Team</option>
            <option value={match.home_team_id}>Home Team</option>
            <option value={match.away_team_id}>Away Team</option>
          </select>

          <select
            value={inlineGoal.scorer_id}
            onChange={(e) =>
              setInlineGoal({ ...inlineGoal, scorer_id: e.target.value })
            }
            disabled={!inlineGoal.team_id}
            className="bg-card text-white text-xs border border-gray-700 rounded-lg py-2 px-2 w-36 disabled:opacity-40"
          >
            <option value="">⚽ Scorer</option>
            {matchPlayers
              .filter((p) => p.team_id === parseInt(inlineGoal.team_id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          <select
            value={inlineGoal.assist_id}
            onChange={(e) =>
              setInlineGoal({ ...inlineGoal, assist_id: e.target.value })
            }
            disabled={!inlineGoal.team_id}
            className="bg-card text-white text-xs border border-gray-700 rounded-lg py-2 px-2 w-36 disabled:opacity-40"
          >
            <option value="">👟 Assist (Opt)</option>
            {matchPlayers
              .filter((p) => p.team_id === parseInt(inlineGoal.team_id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          <input
            type="number"
            placeholder="Min"
            min="1"
            max="120"
            value={inlineGoal.minute}
            onChange={(e) =>
              setInlineGoal({ ...inlineGoal, minute: e.target.value })
            }
            className="w-16 bg-card border border-gray-700 rounded-lg text-center text-xs text-white py-2"
          />
          <button
            onClick={submitInlineGoal}
            className="bg-brand hover:bg-emerald-400 text-dark font-bold text-xs py-2 px-3 rounded-lg transition-colors"
          >
            Log Goal
          </button>
        </div>

        {/* Status Control */}
        <div className="w-full md:w-48 xl:w-36">
          <select
            value={match.status || "Finished"}
            onChange={(e) =>
              handleUpdateMatch(match.id, "status", e.target.value)
            }
            className={`w-full text-sm font-bold border rounded-lg py-2.5 px-3 text-center cursor-pointer appearance-none transition-colors ${match.status === "Live" ? "bg-red-500/10 text-red-500 border-red-500/30" : match.status === "Finished" ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-brand/10 text-brand border-brand/30"}`}
          >
            <option value="Scheduled" className="bg-dark text-white">
              Scheduled
            </option>
            <option value="Live" className="bg-dark text-white">
              Live
            </option>
            <option value="Finished" className="bg-dark text-white">
              Finished
            </option>
          </select>
        </div>
      </div>

      {/* ROW LAYER 2: Live Logged Goals View & Inline Modification */}
      {activeMatchGoals.length > 0 && (
        <div className="mt-2 bg-dark/20 border border-gray-800/60 rounded-lg p-3 flex flex-col gap-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
            Logged Events
          </div>

          <div className="flex flex-col gap-1.5">
            {activeMatchGoals.map((goal) => {
              const isEditing = editingGoalId === goal.id;
              const currentTeamPlayers = safePlayers.filter(
                (p) => p.team_id === goal.team_id,
              );

              return (
                <div
                  key={goal.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-card/60 rounded-md border border-gray-800/40 p-2 text-xs gap-3"
                >
                  {isEditing ? (
                    /* Inline Editor Active State */
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <span className="text-gray-400 font-bold uppercase text-[10px] bg-gray-800 px-1.5 py-0.5 rounded">
                        {goal.team_id === match.home_team_id ? "Home" : "Away"}
                      </span>
                      <input
                        type="number"
                        value={editForm.minute}
                        onChange={(e) =>
                          setEditForm({ ...editForm, minute: e.target.value })
                        }
                        className="w-12 bg-dark border border-gray-700 rounded text-center py-1 text-white"
                      />
                      <span className="text-gray-500">'</span>
                      <select
                        value={editForm.scorer_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            scorer_id: e.target.value,
                          })
                        }
                        className="bg-dark text-white border border-gray-700 rounded py-1 px-1.5 max-w-[140px]"
                      >
                        {currentTeamPlayers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">asst by</span>
                      <select
                        value={editForm.assist_id}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            assist_id: e.target.value,
                          })
                        }
                        className="bg-dark text-white border border-gray-700 rounded py-1 px-1.5 max-w-[140px]"
                      >
                        <option value="">No Assist</option>
                        {currentTeamPlayers
                          .filter((p) => p.id !== parseInt(editForm.scorer_id))
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : (
                    /* Standard Display State */
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="font-mono text-brand font-bold bg-brand/5 px-1.5 py-0.5 rounded border border-brand/10">
                        {goal.minute}'
                      </span>
                      <span className="font-semibold text-white">
                        ⚽ {getPlayerName(goal.scorer_id)}
                      </span>
                      {goal.assist_id && (
                        <span className="text-gray-400 text-[11px]">
                          (👟 assist by {getPlayerName(goal.assist_id)})
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-gray-500 uppercase ml-2 px-1 bg-dark/80 rounded border border-gray-800">
                        {goal.team_id === match.home_team_id ? "Home" : "Away"}
                      </span>
                    </div>
                  )}

                  {/* Operational Action Row Buttons */}
                  <div className="flex items-center gap-2 justify-end">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveGoalEdit(goal.id)}
                          className="text-emerald-400 hover:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingGoalId(null)}
                          className="text-gray-400 hover:bg-gray-700 px-2 py-1 rounded border border-gray-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingGoalId(goal.id);
                            setEditForm({
                              scorer_id: goal.scorer_id,
                              assist_id: goal.assist_id || "",
                              minute: goal.minute,
                            });
                          }}
                          className="text-gray-400 hover:text-white bg-dark/60 border border-gray-800 hover:border-gray-600 px-2 py-1 rounded transition-all"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-400 hover:text-white bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 px-2 py-1 rounded transition-all"
                        >
                          ❌ Offside/Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
