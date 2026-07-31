import { useState, useEffect } from "react";

export default function Players() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    squad_number: "",
    team_id: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  // 1. Fetch teams on load so we can map them to the dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/teams/`,
        );
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // We convert squad_number and team_id to numbers for our API
    setFormData({
      ...formData,
      [name]:
        name === "squad_number" || name === "team_id" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("Registering player...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/players/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        setStatusMessage("Player registered successfully! ⚽");
        setFormData({ name: "", position: "", squad_number: "", team_id: "" });
      } else {
        setStatusMessage("Error registering player.");
      }
    } catch (error) {
      setStatusMessage("Connection error.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Register Player</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-xl border border-gray-800 space-y-4"
      >
        <input
          name="name"
          placeholder="Player Name"
          onChange={handleChange}
          value={formData.name}
          className="w-full bg-dark text-white p-3 rounded border border-gray-700"
          required
        />
        <input
          name="position"
          placeholder="Position (e.g. Forward)"
          onChange={handleChange}
          value={formData.position}
          className="w-full bg-dark text-white p-3 rounded border border-gray-700"
          required
        />
        <input
          type="number"
          name="squad_number"
          placeholder="Squad Number"
          onChange={handleChange}
          value={formData.squad_number}
          className="w-full bg-dark text-white p-3 rounded border border-gray-700"
          required
        />

        <select
          name="team_id"
          onChange={handleChange}
          value={formData.team_id}
          className="w-full bg-dark text-white p-3 rounded border border-gray-700"
          required
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-brand hover:bg-emerald-400 text-dark text-lg font-bold py-3 rounded-lg transition-colors shadow-lg shadow-brand/20"
        >
          Add Player
        </button>
        {statusMessage && (
          <p className="text-center text-sm">{statusMessage}</p>
        )}
      </form>
    </div>
  );
}
