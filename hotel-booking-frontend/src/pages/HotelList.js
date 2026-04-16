import { useEffect, useState } from 'react';
import { getAllHotels, bookHotel } from '../services/api';

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [booking, setBooking] = useState({ hotelId: null, checkInDate: '', checkOutDate: '', rooms: 1 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllHotels()
      .then(({ data }) => setHotels(data))
      .catch(() => setMessage('Failed to load hotels. Please try again.'));
  }, []);

  const openBooking = (hotelId) => setBooking({ hotelId, checkInDate: '', checkOutDate: '', rooms: 1 });

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await bookHotel(booking.hotelId, {
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        rooms: booking.rooms,
      });
      setMessage('Booking confirmed!');
      setBooking({ hotelId: null, checkInDate: '', checkOutDate: '', rooms: 1 });
      getAllHotels().then(({ data }) => setHotels(data));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Available Hotels</h1>
      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {hotel.imageUrl && (
              <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{hotel.name}</h2>
              <p className="text-gray-500 text-sm">📍 {hotel.location}</p>
              <p className="text-gray-600 text-sm mt-1">{hotel.description}</p>
              {hotel.amenities && (
                <p className="text-gray-500 text-xs mt-1">✨ {hotel.amenities}</p>
              )}
              <div className="flex justify-between items-center mt-3">
                <span className="text-blue-700 font-bold">₹{hotel.pricePerNight}/night</span>
                <span className="text-sm text-gray-500">{hotel.availableRooms} rooms left</span>
              </div>
              {hotel.availableRooms > 0 ? (
                <button
                  onClick={() => openBooking(hotel.id)}
                  className="mt-3 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
                >
                  Book Now
                </button>
              ) : (
                <p className="mt-3 text-center text-red-500 font-medium">Fully Booked</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {booking.hotelId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Book Hotel</h3>
            <form onSubmit={handleBook} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Check-in Date</label>
                <input type="date" required
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={booking.checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBooking({ ...booking, checkInDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Check-out Date</label>
                <input type="date" required
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={booking.checkOutDate}
                  min={booking.checkInDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBooking({ ...booking, checkOutDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Number of Rooms</label>
                <input type="number" min="1" required
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={booking.rooms}
                  onChange={(e) => setBooking({ ...booking, rooms: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
                  Confirm Booking
                </button>
                <button type="button" onClick={() => setBooking({ hotelId: null })}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
