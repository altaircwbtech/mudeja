"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/lib/vehicle-actions";

export function VehicleDeleteButton({ vehicleId }: { vehicleId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return;
    
    setIsDeleting(true);
    try {
      await deleteVehicle(vehicleId);
      toast.success("Veículo excluído");
    } catch (err: any) {
      toast.error("Erro ao excluir", { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      title="Excluir veículo"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
