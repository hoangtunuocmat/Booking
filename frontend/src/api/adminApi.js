import axiosClient from './axiosClient';

export const adminApi = {
  getDashboard: () => axiosClient.get('/admin/dashboard'),
  getHotels: () => axiosClient.get('/admin/hotels'),
  createHotel: (hotelData) => axiosClient.post('/admin/hotels', hotelData),
  updateHotelStatus: (hotelId, trangthai) => axiosClient.put(`/admin/hotels/${hotelId}/status`, { trangthai }),
  getOwners: () => axiosClient.get('/admin/owners'),
  getUsers: () => axiosClient.get('/admin/users'),
  updateUserStatus: (username, trangthai) => axiosClient.put(`/admin/users/${username}/status`, { trangthai }),
  getPromos: () => axiosClient.get('/admin/promos'),
  createPromo: (promoData) => axiosClient.post('/admin/promos', promoData),
};
