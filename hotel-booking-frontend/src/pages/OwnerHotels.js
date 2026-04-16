import { useEffect, useState } from 'react';
import { getOwnerHotels, createHotel, updateHotel, deleteHotel } from '../services/api';

const emptyForm = { name: '', location: '', description: '', pricePerNight: '', totalRooms: '', amenities: '', imageUrl: '' };

export default function OwnerHotels() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchHotels = () => getOwnerHotels().then(({ data }) => setHotels(data));

  useEffect(() => { fetchHotels(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateHotel(editId, form);
        setMessage('Hotel updated!');
      } else {
        await createHotel(form);
        setMessage('Hotel created!');
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchHotels();
    } catch {
      setMessage('Operation failed');
    }
  };

  const handleEdit = (hotel) => {
    setForm({
      name: hotel.name, location: hotel.location, description: hotel.description,
      pricePerNight: hotel.pricePerNight, totalRooms: hotel.totalRooms,
      amenities: hotel.amenities || '', imageUrl: hotel.imageUrl || '',
    });
    setEditId(hotel.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    await deleteHotel(id);
    fetchHotels();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">My Hotels</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          + Add Hotel
        </button>
      </div>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Hotel' : 'Add New Hotel'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Hotel Name', type: 'text' },
              { key: 'location', label: 'Location', type: 'text' },
              { key: 'pricePerNight', label: 'Price Per Night (₹)', type: 'number' },
              { key: 'totalRooms', label: 'Total Rooms', type: 'number' },
              { key: 'amenities', label: 'Amenities', type: 'text' },
              { key: 'imageUrl', label: 'Image URL', type: 'url' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="text-sm font-medium">{label}</label>
                <input type={type} required={key !== 'amenities' && key !== 'imageUrl'}
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required rows={3}
                className="w-full border rounded px-3 py-2 mt-1"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
                {editId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow p-4">
            {hotel.imageUrl && <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-40 object-cover rounded mb-3" />}
            <h2 className="text-lg font-bold">{hotel.name}</h2>
            <p className="text-gray-500 text-sm">📍 {hotel.location}</p>
            <p className="text-sm text-gray-600 mt-1">{hotel.description}</p>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-blue-700 font-bold">₹{hotel.pricePerNight}/night</span>
              <span className="text-gray-500">{hotel.availableRooms}/{hotel.totalRooms} available</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(hotel)}
                className="flex-1 bg-yellow-400 text-white py-1 rounded hover:bg-yellow-500">Edit</button>
              <button onClick={() => handleDelete(hotel.id)}
                className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
