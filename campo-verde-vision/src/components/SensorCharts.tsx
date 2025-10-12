import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar 
} from 'recharts';
import { Sun, Droplets, Thermometer, CloudRain, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const API_URL_SENSORS = 'http://localhost:3002/api/sensors';

interface ApiSensorReading {
  _id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  coords: { lat: number; lon: number };
}

type ApiResponse = ApiSensorReading[];

interface FormattedData {
  time: string;
  timestamp: string;
  [key: string]: any;
}

const SensorCharts = () => {
  const { user } = useAuth();
  const [historicalData, setHistoricalData] = useState<FormattedData[]>([]);
  const [latestData, setLatestData] = useState<FormattedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setHasPermission(true);

      const fetchData = async () => {
        try {
          // --- INICIO DE LA NUEVA LÓGICA DE PETICIONES PARALELAS ---
          const sensorTypes = ['temperatura', 'humedad', 'radiacion_solar', 'lluvia'];
          
          // Creamos un array de promesas, una para cada tipo de sensor.
          const requests = sensorTypes.map(type => 
            axios.get<ApiResponse>(`${API_URL_SENSORS}/${type}`, { timeout: 10000 })
          );

          // Ejecutamos todas las peticiones en paralelo y esperamos a que todas terminen.
          const responses = await Promise.all(requests);

          // Combinamos los resultados de todas las respuestas en un único array plano.
          const allReadings = responses.flatMap(response => response.data);
          // --- FIN DE LA NUEVA LÓGICA ---
          
          if (allReadings && allReadings.length > 0) {
            
            // La lógica de transformación sigue siendo la misma, ahora trabaja sobre 'allReadings'.
            const pointsByTime: { [key: string]: any } = {};

            for (const reading of allReadings) {
              const { timestamp, type, value } = reading;
              
              if (!pointsByTime[timestamp]) {
                pointsByTime[timestamp] = {
                  timestamp: timestamp,
                  time: new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                };
              }
              
              pointsByTime[timestamp][type] = value;
            }
            
            const formattedArray = Object.values(pointsByTime);

            formattedArray.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            const finalData = formattedArray.slice(-20);

            setHistoricalData(finalData);
            setLatestData(finalData.length > 0 ? finalData[finalData.length - 1] : null);
          }
        } catch (error) {
          console.error("Error fetching sensor data:", error);
          const description = axios.isAxiosError(error) && error.code === 'ECONNABORTED'
            ? "Una de las peticiones tardó demasiado en responder (timeout)."
            : "No se pudieron obtener los datos de los sensores.";

          toast({
            title: "Error de conexión",
            description: description,
            variant: "destructive",
          });
        } finally {
            setIsLoading(false);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
      setHasPermission(false);
    }
  }, [user]);
  
  const metrics = [
    { title: 'Temperatura', value: latestData?.temperatura?.toFixed(1) || 'N/A', unit: '°C', icon: Thermometer, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { title: 'Humedad', value: latestData?.humedad?.toFixed(1) || 'N/A', unit: '%', icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Lluvia (últ.)', value: latestData?.lluvia?.toFixed(1) || 'N/A', unit: 'mm', icon: CloudRain, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { title: 'Radiación Solar', value: latestData?.radiacion_solar?.toFixed(2) || 'N/A', unit: 'W/m²', icon: Sun, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  ];
  
  if (isLoading) {
    return <p className="text-center text-muted-foreground">Cargando datos de sensores...</p>;
  }

  if (!hasPermission) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert />Acceso Denegado</CardTitle>
          <CardDescription>Necesitas permisos de administrador para visualizar los datos de los sensores.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}><metric.icon className={`w-4 h-4 ${metric.color}`} /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value} <span className="text-sm text-muted-foreground">{metric.unit}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Condiciones Ambientales</CardTitle>
          <CardDescription>Tendencias de temperatura, humedad y radiación solar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} />
                <YAxis yAxisId="left" label={{ value: '°C / %', angle: -90, position: 'insideLeft' }} fontSize={12} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'W/m²', angle: -90, position: 'insideRight' }} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Area yAxisId="right" type="monotone" dataKey="radiacion_solar" name="Radiación Solar" stroke="#ca8a04" fill="#facc15" fillOpacity={0.3} />
                <Line yAxisId="left" type="monotone" dataKey="temperatura" name="Temperatura" stroke="#f97316" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="humedad" name="Humedad" stroke="#2563eb" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registro de Precipitación</CardTitle>
            <CardDescription>Lluvia acumulada en los últimos intervalos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} />
                  <YAxis label={{ value: 'mm', angle: -90, position: 'insideLeft' }} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Bar dataKey="lluvia" name="Lluvia (mm)" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Medidores Actuales</CardTitle>
            <CardDescription>Estado instantáneo de los sensores clave.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="10%" 
                  outerRadius="100%" 
                  data={[
                    { name: 'Temp.', value: latestData?.temperatura || 0, fill: '#f97316' },
                    { name: 'Hum.', value: latestData?.humedad || 0, fill: '#2563eb' },
                  ]} 
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SensorCharts;
