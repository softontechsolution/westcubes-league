import { useState } from 'react';

export default function Teams() {
  // State to manage the form visibility and inputs
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', manager_name: '' });
  const [statusMessage, setStatusMessage] = useState('');

  // Handle typing in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submitting the form to the backend
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
        setFormData({ name: '', manager_name: '' }); // Clear the form
        setTimeout(() => setShowForm(false), 2000);  // Hide form after 2 seconds
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setStatusMessage('Failed to connect to the server. Is Python running?');
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Team Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand hover:bg-emerald-400 text-dark font-bold py-2 px-4 rounded transition-colors shadow-lg"
        >
          {showForm ? 'Cancel' : '+ Register New Team'}
        </button>
      </div>

      {/* Registration Form Section */}
      {showForm && (
        <div className="bg-card p-6 rounded-xl border border-gray-800 mb-8 shadow-xl max-w-lg">
          <h2 className="text-xl font-bold text-white mb-4">Register a Team</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2">Team Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-dark text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-brand"
                placeholder="e.g. Westcubes FC"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2">Manager Name</label>
              <input 
                type="text" 
                name="manager_name"
                value={formData.manager_name}
                onChange={handleChange}
                required
                className="w-full bg-dark text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-brand"
                placeholder="e.g. Pep Guardiola"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-brand hover:bg-emerald-400 text-dark font-bold py-2 rounded transition-colors mt-4"
            >
              Submit Registration
            </button>

            {/* Status Message Display */}
            {statusMessage && (
              <p className={`mt-4 text-sm font-semibold ${statusMessage.includes('Error') || statusMessage.includes('Failed') ? 'text-red-400' : 'text-brand'}`}>
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Team List Placeholder */}
      <div className="bg-card p-8 rounded-xl border border-gray-800 text-center">
        <p className="text-gray-400">No teams registered yet.</p>
        <p className="text-gray-500 text-sm mt-2">(We will build the list view next!)</p>
      </div>
    </div>
  );
}