// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Intenta cargar el usuario desde localStorage al iniciar la app
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Aquí podrías añadir una llamada a una ruta '/auth/me' para validar el token
        // y obtener datos de usuario actualizados, por simplicidad lo tomamos de localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  // No renderizamos la app hasta saber si hay un usuario logueado o no
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para un uso más limpio del contexto
export const useAuth = () => {
  return useContext(AuthContext);
};