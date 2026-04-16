import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col items-center justify-center text-white text-center px-4">
      <h1 className="text-5xl font-bold mb-4">🏨 HotelBook</h1>
      <p className="text-xl mb-8 text-blue-100">Find and book your perfect stay</p>
      {!user ? (
        <div className="flex gap-4">
          <Link to="/register" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50">
            Get Started
          </Link>
          <Link to="/login" className="border-2 border-white px-6 py-3 rounded-lg hover:bg-blue-800">
            Login
          </Link>
        </div>
      ) : user.role === 'OWNER' ? (
        <div className="flex gap-4">
          <Link to="/owner/dashboard" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50">
            Go to Dashboard
          </Link>
          <Link to="/owner/hotels" className="border-2 border-white px-6 py-3 rounded-lg hover:bg-blue-800">
            Manage Hotels
          </Link>
        </div>
      ) : (
        <Link to="/hotels" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50">
          Browse Hotels
        </Link>
      )}
    </div>
  );
}
