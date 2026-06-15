import axiosClient from './axiosClient';

export const ownerApi = {
  getDashboard: (ownerId) => axiosClient.get(`/owner/${ownerId}/dashboard`),
  getHotels: (ownerId) => axiosClient.get(`/owner/${ownerId}/hotels`),
  createHotel: (ownerId, hotelData) => axiosClient.post(`/owner/${ownerId}/hotels`, hotelData),
  updateHotel: (ownerId, hotelId, hotelData) => axiosClient.put(`/owner/${ownerId}/hotels/${hotelId}`, hotelData),
  getRooms: (ownerId, hotelId) => axiosClient.get(`/owner/${ownerId}/hotels/${hotelId}/rooms`),
  createRoom: (ownerId, hotelId, roomData) => axiosClient.post(`/owner/${ownerId}/hotels/${hotelId}/rooms`, roomData),
  updateRoom: (ownerId, hotelId, roomId, roomData) => axiosClient.put(`/owner/${ownerId}/hotels/${hotelId}/rooms/${roomId}`, roomData),
  deleteRoom: (ownerId, hotelId, roomId) => axiosClient.delete(`/owner/${ownerId}/hotels/${hotelId}/rooms/${roomId}`),
  getOrders: (ownerId) => axiosClient.get(`/owner/${ownerId}/orders`),
  updateOrderStatus: (bookingId, trangthai) => axiosClient.put(`/owner/orders/${bookingId}/status`, { trangthai }),
};
