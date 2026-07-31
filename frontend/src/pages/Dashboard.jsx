import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- UPGRADED MATCH INFO MODAL COMPONENT ---
const MatchInfoModal = ({ match, onClose, teams, players, goals = [] }) => {
  if (!match) return null;

  // 1. Resolve Team Names from State Lookup Table
  const homeTeamName =
    teams.find((t) => t.id === match.home_team_id)?.name || "Home Team";
  const awayTeamName =
    teams.find((t) => t.id === match.away_team_id)?.name || "Away Team";

  // 2. Status Color Formatting System
  const getStatusStyles = (status) => {
    switch (status) {
      case "Live":
        return "bg-red-500/10 text-red-500 border border-red-500/20 font-bold animate-pulse text-xs tracking-wider uppercase px-2.5 py-1 rounded-full";
      case "Finished":
        return "bg-emerald-800 text-emerald-400 border border-emerald-700 text-xs font-semibold uppercase px-2.5 py-1 rounded-full";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase px-2.5 py-1 rounded-full";
    }
  };

  // Safe string helper for player lookup
  const getPlayerName = (id) =>
    players?.find((p) => p.id === id)?.name || `Player (${id})`;

  // 3. Filter and Chronologically Sequence Timeline Events
  const matchGoals = goals.filter((g) => g.match_id === match.id);

  let timelineEvents = matchGoals.map((g) => ({
    id: `goal-${g.id}`,
    type: "GOAL",
    minute: g.minute,
    team_id: g.team_id,
    mainPlayer: getPlayerName(g.scorer_id),
    subDetail: g.assist_id ? `assist by ${getPlayerName(g.assist_id)}` : null,
  }));

  // Append match milestone banners depending on match state
  if (match.status === "Finished" || match.status === "Live") {
    timelineEvents.push({
      id: "milestone-ht",
      type: "MILESTONE",
      minute: 45,
      label: "Half Time (HT)",
    });
  }
  if (match.status === "Finished") {
    timelineEvents.push({
      id: "milestone-ft",
      type: "MILESTONE",
      minute: 90,
      label: "Full Time (FT)",
    });
  }

  // Sort events chronologically by match minute
  timelineEvents.sort((a, b) => a.minute - b.minute);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-dark p-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className={getStatusStyles(match.status)}>
              {match.status === "Live" ? "LIVE NOW" : match.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold text-xl w-8 h-8 rounded-full flex items-center justify-center bg-gray-800/50 hover:bg-gray-700 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Dynamic Scoreboard Area */}
        <div className="p-8 flex justify-between items-center bg-gradient-to-b from-gray-900/40 to-transparent border-b border-gray-800/60 relative text-center">
          <div className="text-center w-1/3 flex flex-col items-center">
            <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center font-bold text-brand text-xs mb-2">
              {homeTeamName.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {homeTeamName}
            </h3>
          </div>

          <div className="text-center w-1/3 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-black text-white bg-dark px-4 py-1.5 rounded-xl border border-gray-800 shadow-inner tracking-tight">
              {match.status === "Scheduled" ? (
                <span className="text-gray-500 text-2xl font-medium italic tracking-widest">
                  VS
                </span>
              ) : (
                <>
                  <span
                    className={
                      match.status === "Live" ? "text-red-500" : "text-white"
                    }
                  >
                    {match.home_goals}
                  </span>
                  <span className="text-gray-600 mx-2">:</span>
                  <span
                    className={
                      match.status === "Live" ? "text-red-500" : "text-white"
                    }
                  >
                    {match.away_goals}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium bg-dark/40 px-3 py-1 rounded-md border border-gray-800/60">
              {match.match_date
                ? new Date(match.match_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "TBD"}
            </p>
          </div>

          <div className="text-center w-1/3 flex flex-col items-center">
            <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center font-bold text-brand text-xs mb-2">
              {awayTeamName.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {awayTeamName}
            </h3>
          </div>
        </div>

        {/* LiveScore Styled Timeline Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dark/10">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 mb-4">
            Match Events
          </h4>

          {timelineEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm italic">
              No match events logged yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-gray-800 ml-4 sm:mx-auto sm:border-l-0 sm:before:absolute sm:before:left-1/2 sm:before:top-0 sm:before:bottom-0 sm:before:w-[2px] sm:before:bg-gray-800">
              {timelineEvents.map((event) => {
                if (event.type === "MILESTONE") {
                  return (
                    <div
                      key={event.id}
                      className="relative mb-6 text-center flex justify-center w-full items-center z-10"
                    >
                      <span className="bg-gray-800 text-gray-300 border border-gray-700 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                        {event.minute}' — {event.label}
                      </span>
                    </div>
                  );
                }

                const isHomeEvent = event.team_id === match.home_team_id;

                return (
                  <div
                    key={event.id}
                    className="relative flex items-start mb-6 w-full text-xs"
                  >
                    {/* Centered or Left Anchored Minute Badge */}
                    <div className="absolute -left-[23px] sm:left-1/2 sm:-translate-x-1/2 z-10 flex items-center justify-center bg-dark border border-gray-700 text-brand font-mono font-bold text-[10px] w-9 h-5 rounded-full shadow-sm">
                      {event.minute}'
                    </div>

                    {/* Home Side Event View Column */}
                    <div
                      className={`flex-1 pl-6 sm:pl-0 sm:pr-6 text-left sm:text-right ${isHomeEvent ? "block" : "hidden sm:block opacity-0 pointer-events-none"}`}
                    >
                      {isHomeEvent && (
                        <div className="bg-card/50 border border-gray-800 rounded-lg p-2.5 inline-block max-w-[85%] shadow-sm">
                          <div className="font-bold text-white">
                            ⚽ {event.mainPlayer}
                          </div>
                          {event.subDetail && (
                            <div className="text-gray-400 text-[11px] mt-0.5">
                              {event.subDetail}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Structural Middle Layout Gap Spacer */}
                    <div className="w-10 h-5 hidden sm:block shrink-0" />

                    {/* Away Side Event View Column */}
                    <div
                      className={`flex-1 pl-6 text-left ${!isHomeEvent ? "block" : "hidden sm:block opacity-0 pointer-events-none"}`}
                    >
                      {!isHomeEvent && (
                        <div className="bg-card/50 border border-gray-800 rounded-lg p-2.5 inline-block max-w-[85%] shadow-sm">
                          <div className="font-bold text-white">
                            ⚽ {event.mainPlayer}
                          </div>
                          {event.subDetail && (
                            <div className="text-gray-400 text-[11px] mt-0.5">
                              {event.subDetail}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]); // NEW STATE
  const [goals, setGoals] = useState([]); // NEW STATE
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    // Dynamic background polling worker thread (Updates scores and goal logs every 30s)
    const fetchLiveMatches = async () => {
      try {
        const [matchesRes, goalsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/matches/`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/goals/`),
        ]);

        if (matchesRes.ok && goalsRes.ok) {
          const freshMatches = await matchesRes.json();
          const freshGoals = await goalsRes.json();

          setMatches(freshMatches);
          setGoals(freshGoals);

          // Keep the details active if a modal view card is open during tick
          setSelectedMatch((currentSelected) => {
            if (!currentSelected) return null;
            return (
              freshMatches.find((m) => m.id === currentSelected.id) ||
              currentSelected
            );
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    // Initial sync pipeline
    const fetchInitialData = async () => {
      try {
        const [teamsRes, matchesRes, playersRes, goalsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/teams/`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/matches/`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/players/`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/goals/`),
        ]);

        if (teamsRes.ok) setTeams(await teamsRes.json());
        if (matchesRes.ok) setMatches(await matchesRes.json());
        if (playersRes.ok) setPlayers(await playersRes.json());
        if (goalsRes.ok) setGoals(await goalsRes.json());
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
    const pollingInterval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(pollingInterval);
  }, []);

  // Structural categorizations
  const liveMatches = matches.filter((m) => m.status === "Live");

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          League Overview
        </h1>
        <p className="text-gray-400 mt-1">Westcubes Matchday Center</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR - CLUBS LIST */}
        <div className="lg:col-span-4 bg-card rounded-xl border border-gray-800 shadow-md h-fit">
          <div className="bg-dark p-4 border-b border-gray-800 rounded-t-xl font-bold text-white uppercase tracking-wider">
            League Clubs
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="flex items-center gap-3 p-4 border-b border-gray-800/50 hover:bg-gray-800/30"
              >
                <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-brand font-bold text-xs">
                  {team.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-200">{team.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* MAIN MATCH CENTER STAGE */}
        <div className="lg:col-span-8 space-y-8">
          {/* URGENT HIGHLIGHT: LIVE MATCHES */}
          {liveMatches.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{" "}
                LIVE NOW
              </h2>
              <div className="space-y-2">
                {liveMatches.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMatch(m)}
                    className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-red-500/20 transition-colors"
                  >
                    <span className="font-bold text-white w-1/3 text-right truncate">
                      {m.home_team?.name || getTeamName(m.home_team_id)}
                    </span>
                    <span className="text-red-500 font-mono font-black text-xl px-4 text-center">
                      {m.home_goals} : {m.away_goals}
                    </span>
                    <span className="font-bold text-white w-1/3 text-left truncate">
                      {m.away_team?.name || getTeamName(m.away_team_id)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ALL SCHEDULED FIXTURES & HISTORIC RESULTS MAP */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                Match Center
              </h2>
              <span className="text-xs text-gray-500">Updates every 30s</span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12 text-gray-400">
                  Loading schedules...
                </div>
              ) : matches.length === 0 ? (
                <div className="p-8 text-center bg-card rounded-xl border border-gray-800 text-gray-500">
                  No matches found.
                </div>
              ) : (
                [...matches]
                  .sort((a, b) => {
                    const priority = { Live: 0, Scheduled: 1, Finished: 2 };
                    return (
                      (priority[a.status] || 3) - (priority[b.status] || 3)
                    );
                  })
                  .map((m) => {
                    const getStatusStyles = (status) => {
                      if (status === "Live")
                        return "bg-red-500/5 border-red-500/20 hover:bg-red-500/10";
                      if (status === "Finished")
                        return "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10";
                      return "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10";
                    };

                    const formatDate = (dateString) => {
                      if (!dateString) return "TBD";
                      const d = new Date(dateString);
                      return (
                        d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        }) +
                        " " +
                        d.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      );
                    };

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMatch(m)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${getStatusStyles(m.status)}`}
                      >
                        <div className="flex justify-between items-center">
                          {/* LEFT SIDE INFO */}
                          <div className="w-32 flex flex-col items-start shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                              {formatDate(m.match_date)}
                            </span>
                            {m.status === "Live" && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                                LIVE
                              </span>
                            )}
                            {m.status === "Finished" && (
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                FINAL
                              </span>
                            )}
                            {m.status === "Scheduled" && (
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                                PLANNED
                              </span>
                            )}
                          </div>

                          {/* CORE GAME CARD DISPLAY */}
                          <div className="flex-1 flex items-center justify-center gap-4 px-2">
                            <span className="font-semibold text-gray-200 truncate text-right w-28">
                              {m.home_team?.name || getTeamName(m.home_team_id)}
                            </span>

                            <div
                              className={`flex items-center gap-2 font-black text-sm font-mono ${m.status !== "Scheduled" ? "bg-dark px-3 py-1 rounded border border-gray-800" : ""}`}
                            >
                              {m.status === "Scheduled" ? (
                                <span className="text-gray-500 text-xs font-medium tracking-widest italic">
                                  VS
                                </span>
                              ) : (
                                <>
                                  <span
                                    className={
                                      m.status === "Live"
                                        ? "text-red-500"
                                        : "text-brand"
                                    }
                                  >
                                    {m.home_goals}
                                  </span>
                                  <span className="text-gray-600">:</span>
                                  <span
                                    className={
                                      m.status === "Live"
                                        ? "text-red-500"
                                        : "text-brand"
                                    }
                                  >
                                    {m.away_goals}
                                  </span>
                                </>
                              )}
                            </div>

                            <span className="font-semibold text-gray-200 truncate text-left w-28">
                              {m.away_team?.name || getTeamName(m.away_team_id)}
                            </span>
                          </div>

                          {/* RIGHT SIDE TAG */}
                          <div className="w-24 text-right hidden sm:block shrink-0">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </section>
        </div>
      </div>

      {/* RENDER MODAL PASSING IN DOWNSTREAM STATES */}
      <MatchInfoModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        teams={teams}
        players={players}
        goals={goals}
      />
    </div>
  );
}
