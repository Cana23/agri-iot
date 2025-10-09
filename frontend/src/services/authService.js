// src/services/authService.js
import apiClient from './api';

const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      // Guardamos el token en localStorage para mantener la sesión
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error en el registro:", error.response?.data || error.message);
    throw error;
  }
};

const logout = () => {
  // Simplemente removemos el token del almacenamiento local
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const authService = {
  login,
  register,
  logout,
};