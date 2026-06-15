import axiosClient from './axiosClient';

export const bookingApi = {
  createBooking: (bookingData) => axiosClient.post('/bookings', bookingData),
  getBookings: () => axiosClient.get('/bookings'),
};
