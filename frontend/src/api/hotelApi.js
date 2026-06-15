import axiosClient from './axiosClient';

export const hotelApi = {
  getHotels: () => axiosClient.get('/hotels'),
  getHotelById: (id) => axiosClient.get(`/hotels/${id}`)
};
