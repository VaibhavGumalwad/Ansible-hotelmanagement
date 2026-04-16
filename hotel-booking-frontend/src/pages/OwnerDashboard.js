import { useEffect, useState } from 'react';
import { getOwnerBookings } from '../services/api';
import { useAuth } from '../AuthContext';

const statusColor = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getOwnerBookings().then(({ data }) => setBookings(data));
  }, []);

  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Owner Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome back, {user?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-5 shadow text-center">
          <p className="text-4xl font-bold text-blue-700">{bookings.length}</p>
          <p className="text-gray-600 mt-1">Total Bookings</p>
        </div>
        <div className="bg-green-50 rounded-lg p-5 shadow text-center">
          <p className="text-4xl font-bold text-green-600">{confirmed}</p>
          <p className="text-gray-600 mt-1">Active Bookings</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-5 shadow text-center">
          <p className="text-4xl font-bold text-yellow-600">₹{totalRevenue.toFixed(0)}</p>
          <p className="text-gray-600 mt-1">Total Revenue</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">All Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                {['#', 'Hotel', 'Customer', 'Check-in', 'Check-out', 'Rooms', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{b.hotel.name}</td>
                  <td className="px-4 py-3">{b.customer.name}</td>
                  <td className="px-4 py-3">{b.checkInDate}</td>
                  <td className="px-4 py-3">{b.checkOutDate}</td>
                  <td className="px-4 py-3">{b.rooms}</td>
                  <td className="px-4 py-3 font-medium">₹{b.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
