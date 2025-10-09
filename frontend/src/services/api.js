// src/services/api.js
import axios from 'axios';

// La URL base de tu gateway o de tus microservicios
// Cambia esto por la URL real de tu backend
const API_URL = 'http://localhost:5000/api'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las cabeceras de las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtenemos el token guardado
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;