import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      if (!isAuthEndpoint) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getAllHotels = () => API.get('/hotels/all');
export const getOwnerHotels = () => API.get('/owner/hotels');
export const createHotel = (data) => API.post('/owner/hotels', data);
export const updateHotel = (id, data) => API.put(`/owner/hotels/${id}`, data);
export const deleteHotel = (id) => API.delete(`/owner/hotels/${id}`);

export const bookHotel = (hotelId, data) => API.post(`/bookings/hotel/${hotelId}`, data);
export const getMyBookings = () => API.get('/bookings/my');
export const getOwnerBookings = () => API.get('/bookings/owner');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
