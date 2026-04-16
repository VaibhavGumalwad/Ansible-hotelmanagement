import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';

const statusColor = {
  CONFIRMED: 'text-green-600',
  CANCELLED: 'text-red-500',
  COMPLETED: 'text-gray-500',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => getMyBookings().then(({ data }) => setBookings(data));

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    fetchBookings();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-lg shadow p-5 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">{b.hotel.name}</h2>
                <p className="text-gray-500 text-sm">📍 {b.hotel.location}</p>
                <p className="text-sm mt-1">
                  📅 {b.checkInDate} → {b.checkOutDate} | 🛏 {b.rooms} room(s)
                </p>
                <p className="text-sm font-medium mt-1">Total: ₹{b.totalAmount}</p>
                <p className={`text-sm font-bold mt-1 ${statusColor[b.status]}`}>{b.status}</p>
              </div>
              {b.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleCancel(b.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
