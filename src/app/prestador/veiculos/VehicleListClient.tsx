'use client'

import { useState } from "react";
import { Truck, Plus, Trash2, Camera, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { addVehicle, deleteVehicle } from "./actions";

interface Vehicle {
  id: string;
  vehicle_type: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  plate: string | null;
  photo_url: string | null;
}

interface VehicleListClientProps {
  initialVehicles: Vehicle[];
  providerId: string;
}

export default function VehicleListClient({ initialVehicles, providerId }: VehicleListClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState(initialVehicles);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("provider_id", providerId);

    try {
      const result = await addVehicle(formData);
      if (result.success) {
        toast.success("Veículo adicionado com sucesso!");
        setShowForm(false);
        // We'll let the page refresh handle the list update via revalidatePath,
        // but for a better UX we could update local state too.
        window.location.reload(); 
      } else {
        toast.error(result.error || "Erro ao adicionar veículo");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return;

    try {
      const result = await deleteVehicle(id);
      if (result.success) {
        toast.success("Veículo removido");
        setVehicles(prev => prev.filter(v => v.id !== id));
      } else {
        toast.error(result.error || "Erro ao excluir");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button / Toggle */}
      {!showForm && (
        <Button 
          onClick={() => setShowForm(true)} 
          className="w-full h-16 rounded-2xl border-dashed border-2 bg-white text-primary hover:bg-primary/5 border-primary/20 flex gap-2 font-bold"
          variant="outline"
        >
          <Plus className="h-5 w-5" /> Adicionar Novo Veículo
        </Button>
      )}

      {/* Add Form */}
      {showForm && (
        <Card className="border-primary/20 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
             <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">Novo Veículo</CardTitle>
             <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
             </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Tipo de Veículo</Label>
                  <Select name="vehicle_type" required>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utilitario">Utilitário (Fiorino, etc)</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="caminhonete">Caminhonete / HR</SelectItem>
                      <SelectItem value="caminhao_34">Caminhão 3/4</SelectItem>
                      <SelectItem value="caminhao_toco">Caminhão Toco</SelectItem>
                      <SelectItem value="caminhao_truck">Caminhão Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input name="brand" placeholder="Ex: Mercedes, VW, Ford" className="rounded-xl h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input name="model" placeholder="Ex: Accelo 815, 24-250" className="rounded-xl h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa (Opcional)</Label>
                  <Input name="plate" placeholder="ABC-1234" className="rounded-xl h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Foto do Veículo</Label>
                <div className="relative group border-2 border-dashed rounded-2xl h-32 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden">
                    <input 
                        type="file" 
                        name="photo" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Camera className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                    <span className="text-xs text-slate-400 mt-2">Toque para selecionar foto</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                    type="submit" 
                    className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20" 
                    disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Salvar Veículo"}
                </Button>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setShowForm(false)}
                    className="h-12 rounded-xl"
                >
                    Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Vehicle List */}
      <div className="grid gap-4">
        {vehicles.length === 0 && !showForm && (
            <div className="text-center py-10 opacity-50">
                <Truck className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Nenhum veículo cadastrado.</p>
            </div>
        )}
        {vehicles.map((v) => (
          <Card key={v.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-0 flex">
              <div className="w-24 sm:w-32 h-24 sm:h-32 bg-slate-100 shrink-0 relative overflow-hidden">
                {v.photo_url ? (
                  <img src={v.photo_url} alt={v.model || ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Truck className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize text-[10px] font-black tracking-widest bg-slate-100 border-none">
                      {v.vehicle_type.replace('_', ' ')}
                    </Badge>
                    <button 
                        onClick={() => handleDelete(v.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1">{v.brand} {v.model}</h4>
                  <p className="text-xs text-muted-foreground">{v.plate || "Placa não informada"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
