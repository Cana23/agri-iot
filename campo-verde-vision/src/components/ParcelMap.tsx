import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

// -> 1. Definimos la URL y la interfaz, igual que en ParcelList
const API_URL_PARCELS = 'http://localhost:3003/api/parcels';

interface Parcel {
  id: number;
  nombre: string;
  ubicacion: string; // Esperamos un string como "17.96, -92.96"
  cultivo: string;
  responsable: string;
  activo: boolean;
  userId: number;
}

const ParcelMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Guardará la instancia del mapa de Leaflet
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // -> 2. useEffect para cargar dinámicamente los scripts y estilos de Leaflet
  useEffect(() => {
    // Evita duplicar los scripts si el componente se recarga
    if (document.getElementById('leaflet-css')) return;

    const leafletCss = document.createElement('link');
    leafletCss.id = 'leaflet-css';
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const leafletScript = document.createElement('script');
    leafletScript.id = 'leaflet-js';
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.body.appendChild(leafletScript);

    // Función de limpieza para eliminar los scripts al desmontar el componente
    return () => {
      leafletCss.remove();
      leafletScript.remove();
    };
  }, []);

  // -> 3. useEffect principal para buscar datos e inicializar el mapa
  useEffect(() => {
    // Función para parsear la ubicación y manejar errores
    const parseLocation = (location: string): [number, number] | null => {
      const parts = location.split(',').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
      }
      return null;
    };

    // Función para inicializar y dibujar el mapa
    const initializeMap = (parcels: Parcel[]) => {
      // Solo inicializa si el contenedor existe, Leaflet está cargado y no hay un mapa ya
      if (mapContainerRef.current && (window as any).L && !mapInstanceRef.current) {
        const L = (window as any).L;
        const activeParcels = parcels.filter(p => p.activo && p.ubicacion);

        // Si no hay parcelas con ubicación, no mostramos el mapa
        if (activeParcels.length === 0) {
          setIsLoading(false);
          return;
        }

        // Centramos el mapa en la primera parcela
        const defaultCenter = parseLocation(activeParcels[0].ubicacion) || [17.98, -92.94];

        const map = L.map(mapContainerRef.current).setView(defaultCenter, 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Añadimos un marcador para cada parcela activa
        activeParcels.forEach(parcel => {
          const position = parseLocation(parcel.ubicacion);
          if (position) {
            L.marker(position).addTo(map)
              .bindPopup(`<b>${parcel.nombre}</b><br>Cultivo: ${parcel.cultivo}`);
          }
        });
      }
    };

    // Función para buscar datos
    const fetchAndDrawMap = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get<Parcel[]>(API_URL_PARCELS);
        initializeMap(response.data);
      } catch (error) {
        console.error("Error fetching parcels for map:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del mapa.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Verificamos si Leaflet se ha cargado antes de intentar usarlo
    const checkLeafletAndFetch = () => {
      if ((window as any).L) {
        fetchAndDrawMap();
      } else {
        setTimeout(checkLeafletAndFetch, 100); // Si no, esperamos 100ms y reintentamos
      }
    };

    checkLeafletAndFetch();

  }, [user]); // Se ejecuta cuando el estado del usuario cambia

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Parcelas</CardTitle>
        <CardDescription>Ubicación geográfica de tus parcelas activas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden border">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Cargando mapa...</p>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ParcelMap;
