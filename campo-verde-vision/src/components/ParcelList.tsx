import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Trash2, RotateCcw, Plus, Edit, User, Sprout } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth'; // -> 1. Importamos useAuth para la autenticación

// -> 2. Definimos la URL de nuestra API de parcelas
const API_URL_PARCELS = 'http://localhost:3003/api/parcels';

// -> 3. Sincronizamos la interfaz de Parcela con el modelo del backend
interface Parcel {
  id: number; // El ID ahora es numérico
  nombre: string;
  ubicacion: string; // Simplificado a un string como en el backend
  cultivo: string;
  responsable: string;
  activo: boolean; // Usamos 'activo' (boolean) en lugar de 'status' (string)
  userId: number;
}

// -> 4. Actualizamos el esquema de validación para que coincida con la nueva interfaz
const parcelSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es requerido').max(100),
  ubicacion: z.string().trim().min(1, 'La ubicación es requerida'),
  cultivo: z.string().trim().min(1, 'El tipo de cultivo es requerido'),
  responsable: z.string().trim().min(1, 'El responsable es requerido'),
});

const ParcelList = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    cultivo: '',
    responsable: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { user } = useAuth(); // Obtenemos el usuario para los permisos

  // -> 5. Función central para obtener todas las parcelas desde la API
  const fetchParcels = async () => {
    if (!user) return; // No hacer nada si el usuario no está logueado
    try {
      // Hacemos las peticiones en paralelo para ser más eficientes
      const [activeRes, deletedRes] = await Promise.all([
        axios.get(`${API_URL_PARCELS}`), // El token ya está en los headers gracias a useAuth
        axios.get(`${API_URL_PARCELS}/deleted`),
      ]);
      // Combinamos ambos resultados en un solo estado
      setParcels([...activeRes.data, ...deletedRes.data]);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las parcelas.",
        variant: "destructive",
      });
    }
  };

  // -> 6. useEffect para cargar los datos iniciales cuando el componente se monta
  useEffect(() => {
    fetchParcels();
  }, [user]); // Se ejecuta cuando el usuario está disponible

  const activeParcels = parcels.filter((p) => p.activo);
  const deletedParcels = parcels.filter((p) => !p.activo);

  const openDialog = (parcel?: Parcel) => {
    if (parcel) {
      setEditingParcel(parcel);
      setFormData({
        nombre: parcel.nombre,
        ubicacion: parcel.ubicacion,
        cultivo: parcel.cultivo,
        responsable: parcel.responsable,
      });
    } else {
      setEditingParcel(null);
      setFormData({ nombre: '', ubicacion: '', cultivo: '', responsable: '' });
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // -> 7. handleSubmit ahora se comunica con la API para crear o actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      const validatedData = parcelSchema.parse(formData);

      if (editingParcel) {
        // Lógica de ACTUALIZACIÓN (PUT)
        await axios.put(`${API_URL_PARCELS}/${editingParcel.id}`, validatedData);
        toast({ title: 'Parcela actualizada', description: 'Los cambios se guardaron correctamente' });
      } else {
        // Lógica de CREACIÓN (POST)
        await axios.post(API_URL_PARCELS, validatedData);
        toast({ title: 'Parcela creada', description: 'La nueva parcela se agregó correctamente' });
      }

      setIsDialogOpen(false);
      fetchParcels(); // -> Recargamos los datos para ver los cambios
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((err) => { if (err.path[0]) { errors[err.path[0].toString()] = err.message; } });
        setFormErrors(errors);
      } else {
        toast({ title: "Error", description: "No se pudo guardar la parcela.", variant: "destructive" });
      }
    }
  };

  // -> 8. deleteParcel ahora llama al endpoint de DELETE (soft delete)
  const deleteParcel = async (id: number) => {
    try {
      await axios.delete(`${API_URL_PARCELS}/${id}`);
      toast({ title: 'Parcela eliminada', description: 'La parcela ha sido movida a eliminadas' });
      fetchParcels(); // -> Recargamos los datos
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la parcela.", variant: "destructive" });
    }
  };

  // -> 9. restoreParcel ahora llama al endpoint de UPDATE para cambiar el estado 'activo'
  const restoreParcel = async (id: number) => {
    try {
      await axios.put(`${API_URL_PARCELS}/${id}`, { activo: true });
      toast({ title: 'Parcela restaurada', description: 'La parcela ha sido restaurada exitosamente' });
      fetchParcels(); // -> Recargamos los datos
    } catch (error) {
      toast({ title: "Error", description: "No se pudo restaurar la parcela.", variant: "destructive" });
    }
  };
  
  // -> 10. ParcelCard actualizado para mostrar los nuevos datos
  const ParcelCard = ({ parcel, showRestore }: { parcel: Parcel; showRestore?: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{parcel.nombre}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" /><span>{parcel.ubicacion}</span>
            </CardDescription>
          </div>
          <Badge variant={showRestore ? 'secondary' : 'default'}>{showRestore ? 'Eliminada' : 'Activa'}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground flex items-center gap-1"><Sprout className="w-3 h-3" />Cultivo</p>
              <p className="font-semibold">{parcel.cultivo}</p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" />Responsable</p>
              <p className="font-semibold">{parcel.responsable}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {showRestore ? (
              <Button onClick={() => restoreParcel(parcel.id)} variant="outline" size="sm" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />Restaurar
              </Button>
            ) : (
              <>
                <Button onClick={() => openDialog(parcel)} variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />Editar
                </Button>
                <Button onClick={() => deleteParcel(parcel.id)} variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />Eliminar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Parcelas</h2>
          <p className="text-muted-foreground">Administra tus parcelas agrícolas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button onClick={() => openDialog()}><Plus className="w-4 h-4 mr-2" />Nueva Parcela</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingParcel ? 'Editar Parcela' : 'Nueva Parcela'}</DialogTitle>
                <DialogDescription>{editingParcel ? 'Modifica los datos de la parcela' : 'Ingresa los datos de la nueva parcela'}</DialogDescription>
              </DialogHeader>
              {/* -> 11. Formulario actualizado con los nuevos campos */}
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                  {formErrors.nombre && <p className="text-sm text-destructive">{formErrors.nombre}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación (Lat, Lon) *</Label>
                  <Input id="ubicacion" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} placeholder="Ej: 17.96, -92.96"/>
                  {formErrors.ubicacion && <p className="text-sm text-destructive">{formErrors.ubicacion}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cultivo">Cultivo *</Label>
                  <Input id="cultivo" value={formData.cultivo} onChange={(e) => setFormData({ ...formData, cultivo: e.target.value })} placeholder="Ej: Maíz"/>
                  {formErrors.cultivo && <p className="text-sm text-destructive">{formErrors.cultivo}</p>}
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="responsable">Responsable *</Label>
                  <Input id="responsable" value={formData.responsable} onChange={(e) => setFormData({ ...formData, responsable: e.target.value })} placeholder="Ej: Juan Pérez"/>
                  {formErrors.responsable && <p className="text-sm text-destructive">{formErrors.responsable}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingParcel ? 'Guardar Cambios' : 'Crear Parcela'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active">Activas ({activeParcels.length})</TabsTrigger>
          <TabsTrigger value="deleted">Eliminadas ({deletedParcels.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {activeParcels.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-12"><MapPin className="w-12 h-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No hay parcelas activas</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeParcels.map((parcel) => (<ParcelCard key={parcel.id} parcel={parcel} />))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="deleted" className="space-y-4">
          {deletedParcels.length === 0 ? (
            <Card><CardContent className="flex flex-col items-center justify-center py-12"><Trash2 className="w-12 h-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No hay parcelas eliminadas</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deletedParcels.map((parcel) => (<ParcelCard key={parcel.id} parcel={parcel} showRestore />))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParcelList;
