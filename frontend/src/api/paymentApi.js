import axiosClient from './axiosClient';

export const paymentApi = {
  verifyPromo: (code, basePrice) => axiosClient.post('/payments/verify-promo', { code, basePrice }),
  createPayment: (paymentData) => axiosClient.post('/payments/create', paymentData)
};
