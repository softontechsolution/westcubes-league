import { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, data, type, onSave }) {
  const [formData, setFormData] = useState({});

  // Sync state when data changes
  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `http://localhost:8000/${type}s/${data.id}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave(); // Trigger parent refresh
        onClose(); // Close modal
      }
    } catch (error) { console.error("Update failed", error); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-gray-800 w-96">
        <h2 className="text-xl font-bold text-white mb-4">Edit {type}</h2>
        
        {/* Dynamic Fields: Loop through keys to create inputs */}
        {Object.keys(formData).map((key) => {
            if (key === 'id') return null; // Don't allow editing IDs
            return (
                <div key={key} className="mb-3">
                    <label className="text-gray-400 text-xs uppercase">{key}</label>
                    <input 
                        value={formData[key]} 
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                        className="w-full bg-dark text-white p-2 rounded border border-gray-700"
                    />
                </div>
            );
        })}

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="text-gray-400 px-4">Cancel</button>
          <button type="submit" className="bg-brand text-dark font-bold px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}