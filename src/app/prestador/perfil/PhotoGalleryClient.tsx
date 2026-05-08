'use client'

import { useState } from "react";
import { ImageIcon, Plus, Trash2, Loader2, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { addWorkPhoto, deleteWorkPhoto } from "./actions";

interface WorkPhoto {
  id: string;
  url: string;
  caption: string | null;
}

interface PhotoGalleryClientProps {
  initialPhotos: WorkPhoto[];
  providerId: string;
}

export default function PhotoGalleryClient({ initialPhotos, providerId }: PhotoGalleryClientProps) {
  const [photos, setPhotos] = useState<WorkPhoto[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("provider_id", providerId);

    try {
      const result = await addWorkPhoto(formData);
      if (result.success && result.photo) {
        setPhotos(prev => [result.photo as WorkPhoto, ...prev]);
        toast.success("Foto adicionada à galeria!");
      } else {
        toast.error(result.error || "Erro ao subir foto");
      }
    } catch (error) {
      toast.error("Erro inesperado no upload");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteWorkPhoto(id);
      if (result.success) {
        setPhotos(prev => prev.filter(p => p.id !== id));
        toast.success("Foto removida");
      } else {
        toast.error(result.error || "Erro ao remover");
      }
    } catch (error) {
      toast.error("Erro ao remover foto");
    }
  };

  return (
    <Card className="border-none shadow-lg shadow-primary/5 bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Galeria de Trabalhos
          </div>
          <span className="text-xs font-normal text-muted-foreground bg-white px-2 py-1 rounded-full border">
            {photos.length} fotos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {/* Upload Button */}
          <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-slate-100 hover:border-primary/30 group overflow-hidden">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <>
                <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Add Foto</span>
              </>
            )}
          </label>

          {/* Photos Grid */}
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden group shadow-sm border border-slate-100">
              <img src={photo.url} alt="Trabalho" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  onClick={() => handleDelete(photo.id)}
                  className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors border border-white/30 shadow-lg"
                 >
                    <Trash2 className="h-5 w-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && !uploading && (
           <div className="mt-4 flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
              <Camera className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-muted-foreground max-w-[180px]">
                Nenhuma foto ainda. Adicione fotos do seu caminhão ou serviços realizados.
              </p>
           </div>
        )}

        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-[10px] leading-relaxed text-amber-800">
            <strong>Dica de Especialista:</strong> Fotos de caminhões adesivados, móveis bem embalados e sua equipe uniformizada passam muita credibilidade!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
