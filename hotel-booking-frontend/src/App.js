import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelList from './pages/HotelList';
import MyBookings from './pages/MyBookings';
import OwnerHotels from './pages/OwnerHotels';
import OwnerDashboard from './pages/OwnerDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels" element={
            <PrivateRoute role="CUSTOMER"><HotelList /></PrivateRoute>
          } />
          <Route path="/my-bookings" element={
            <PrivateRoute role="CUSTOMER"><MyBookings /></PrivateRoute>
          } />
          <Route path="/owner/hotels" element={
            <PrivateRoute role="OWNER"><OwnerHotels /></PrivateRoute>
          } />
          <Route path="/owner/dashboard" element={
            <PrivateRoute role="OWNER"><OwnerDashboard /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
