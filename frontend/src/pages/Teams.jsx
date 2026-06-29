import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditModal from "../components/EditModal";

export default function Teams() {
  const [showForm, setShowForm] = useState(false);
  const [teams, setTeams] = useState([]); // State to hold our list of teams
  const [formData, setFormData] = useState({ name: '', manager_name: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // 1. FUNCTION TO FETCH TEAMS FROM BACKEND
  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:8000/teams/');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        console.error('Failed to load teams');
      }
    } catch (error) {
      console.error('Error connecting to API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. RUN FETCH WHEN THE PAGE LOADS
  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SUBMIT FORM AND REFRESH LIST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Registering...');

    try {
      const response = await fetch('http://localhost:8000/teams/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage('Team registered successfully! ⚽');
        setFormData({ name: '', manager_name: '' }); 
        
        // Refresh our local list immediately so the user sees their new team
        await fetchTeams(); 
        
        setTimeout(() => {
          setShowForm(false);
          setStatusMessage('');
        }, 1500);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setStatusMessage('Failed to connect to the server.');
    }
  };

   // 4. DELETE TEAM FUNCTION
   const handleDelete = async (id, type) => {
      if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
      try {
        const response = await fetch(`http://localhost:8000/${type}s/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setTeams(teams.filter(t => t.id !== id)); // Efficiently update UI
          alert(`${type} deleted successfully.`);
        }
      } catch (error) { console.error("Delete failed", error); }
    };

  // 5. When user clicks "Edit"
const handleEdit = (item) => {
  setActiveItem(item);
  setIsModalOpen(true);
};

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-wide">Team Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand hover:bg-emerald-400 text-dark font-bold py-2 px-4 rounded-lg transition-colors shadow-lg"
        >
          {showForm ? 'Cancel' : '+ Register New Team'}
        </button>
      </div>

      <EditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={activeItem} 
        type="team" 
        onSave={() => window.location.reload()}
      />

      {/* Registration Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-xl border border-gray-800 mb-8 shadow-xl max-w-lg">
          <h2 className="text-xl font-bold text-white mb-4">Register a Team</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Team Name" value={formData.name} onChange={handleChange} className="w-full bg-dark text-white p-2 rounded border border-gray-700" required />
            <input name="manager_name" placeholder="Manager Name" value={formData.manager_name} onChange={handleChange} className="w-full bg-dark text-white p-2 rounded border border-gray-700" required />
            <button type="submit" className="w-full bg-brand text-dark font-bold py-2 rounded">Submit</button>
          </form>
        </div>
      )}

      {/* DYNAMIC TEAM LIST */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading teams...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div 
              key={team.id} 
              className="bg-card rounded-xl border border-gray-800 p-6 shadow-md transition-all hover:border-brand/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center font-bold text-brand">
                    {team.name.substring(0, 2).toUpperCase()}
                  </div>
                  {/* NAVIGATION ONLY ON NAME */}
                  <Link to={`/teams/${team.id}`}>
                    <h3 className="text-xl font-bold text-white tracking-wide hover:text-brand transition-colors cursor-pointer">
                      {team.name}
                    </h3>
                  </Link>
                  <span className="text-xs bg-dark px-2.5 py-1 rounded-full text-emerald-400 border border-emerald-500/20 font-medium mx-4">
                    Active Member
                  </span>
                </div>
                <div className="space-y-1 border-t border-gray-800 pt-3">
                  <p className="text-gray-400 text-sm">
                    <span className="text-gray-500 font-medium">Manager:</span> {team.manager_name}
                  </p>
                </div>
              </div>
              
              {/* BUTTONS: Independent and now perfectly clickable */}
              <div className="mt-6 flex justify-end gap-2">
                {/* Edit Button */}
                <button 
                  onClick={() => handleEdit(team)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(team.id, 'team')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}