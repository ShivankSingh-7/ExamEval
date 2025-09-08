// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const user = localStorage.getItem('examEvalUser');
    if (user && user !== 'undefined') {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
        localStorage.removeItem('examEvalUser'); // remove corrupted entry
      }
    }
    setLoading(false);
  }, []);


  // Register user
  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      const { data, token } = response.data;
      setCurrentUser(data);
      localStorage.setItem('examEvalUser', JSON.stringify(data));
      localStorage.setItem('examEvalToken', token);
      return true; // registration successful
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Registration failed');
      return false; // registration failed
    }
  };

  // Login user
  const login = async (email, password, role) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
        role,
      });
      setCurrentUser(data.user);
      localStorage.setItem('examEvalUser', JSON.stringify(data.user));
      localStorage.setItem('examEvalToken', data.token);
      return data.user; // return user for role-based redirection
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('examEvalUser');
    localStorage.removeItem('examEvalToken');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
