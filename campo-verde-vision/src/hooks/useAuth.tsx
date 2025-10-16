import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  // -> 1. Nos aseguramos que la interfaz espere 'name'
  register: (email: string, password: string, name: string) => Promise<void>; 
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3004/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // ... (sin cambios en la función login)
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      // -> PASO CLAVE: Revisa qué imprime esta línea en la consola <--
    console.log('Respuesta REAL de la API:', response.data);

      const { token, user } = response.data;
      
      if (token && user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido de nuevo, ${user.username}`,
        });
        
        navigate('/dashboard');
      } else {
        throw new Error('La respuesta de la API no es válida');
      }
    } catch (error) {
      console.error("Error en el login:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Credenciales inválidas o error en el servidor';
          
      throw new Error(errorMessage);
    }
  };

  // -> 2. La función ahora recibe 'name' para ser consistente
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        // -> 3. Mapeamos 'name' a 'username' para la API
        username: name,
        email,
        password,
        role: 'user'
      });

      const { token, user } = response.data;

      if (token && user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada y has iniciado sesión.",
        });
        
        navigate('/dashboard');
      } else {
        throw new Error('La respuesta de la API de registro no es válida');
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'No se pudo completar el registro. Inténtalo de nuevo.';
            
      throw new Error(errorMessage);
    }
  };
  
  const logout = () => {
    // ... (sin cambios en la función logout)
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}