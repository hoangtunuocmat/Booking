import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData)
};
