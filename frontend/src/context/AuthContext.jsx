import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('Customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user data is stored in localStorage
    const savedUser = localStorage.getItem('booking_user');
    const savedProfile = localStorage.getItem('booking_profile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setRole(parsedProfile.vaitro || 'Customer');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response.data && response.data.success) {
        const { user: userData, session, profile } = response.data;
        setUser(userData);
        setProfile(profile || null);
        const userRole = profile?.vaitro || userData?.user_metadata?.role || 'Customer';
        setRole(userRole);
        
        localStorage.setItem('booking_token', session?.access_token || '');
        localStorage.setItem('booking_user', JSON.stringify(userData));
        localStorage.setItem('booking_profile', JSON.stringify(profile || {}));
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || 'Login connection failed';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, phone, password, userRole = 'Customer') => {
    setLoading(true);
    try {
      const response = await authApi.register({ name, email, phone, password, role: userRole });
      if (response.data && response.data.success) {
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      console.error('Register error:', err);
      const errMsg = err.response?.data?.message || 'Registration connection failed';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setProfile(null);
    setRole('Customer');
    localStorage.removeItem('booking_token');
    localStorage.removeItem('booking_user');
    localStorage.removeItem('booking_profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, login: loginUser, register: registerUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
