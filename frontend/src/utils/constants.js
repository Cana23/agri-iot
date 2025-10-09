// src/utils/constants.js

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Sensores
  SENSORS_LATEST: '/sensors/latest',
  SENSORS_HISTORY: '/sensors/history',

  // Parcelas
  PLOTS: '/plots',
  PLOTS_DELETED: '/plots/deleted',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'usuario',
};