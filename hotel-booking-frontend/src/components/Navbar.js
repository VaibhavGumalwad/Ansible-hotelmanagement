import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">🏨 HotelBook</Link>
      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm">Hi, {user.name} ({user.role})</span>
            {user.role === 'OWNER' ? (
              <>
                <Link to="/owner/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/owner/hotels" className="hover:underline">My Hotels</Link>
              </>
            ) : (
              <>
                <Link to="/hotels" className="hover:underline">Browse Hotels</Link>
                <Link to="/my-bookings" className="hover:underline">My Bookings</Link>
              </>
            )}
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
