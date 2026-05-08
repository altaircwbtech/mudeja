"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Image as ImageIcon, ChevronLeft, Upload, Trash2, Plus, Camera, Loader2, X } from "lucide-react";
import { uploadPhotoAction, removePhotoAction } from "./actions";

export default function ProviderPhotosPage({ 
  providerId, 
  initialPhotos 
}: { 
  providerId: string, 
  initialPhotos: any[] 
}) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState(initialPhotos);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpload(formData: FormData) {
    startTransition(async () => {
      const result = await uploadPhotoAction(formData, providerId, photos.length);
      if (result.success && result.photo) {
        setPhotos([result.photo, ...photos]);
        setPreview(null);
        setCaption("");
      } else {
        alert(result.error || "Erro ao subir imagem. Verifique se criou o bucket 'trabalhos' no Supabase.");
      }
    });
  }

  async function handleRemove(id: string, url: string) {
    if (!confirm("Tem certeza que deseja remover esta foto?")) return;
    
    startTransition(async () => {
      const success = await removePhotoAction(id, url);
      if (success) {
        setPhotos(photos.filter(p => p.id !== id));
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link href="/prestador" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <Logo size="sm" />
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Fotos de Trabalhos
          </h1>
          <p className="text-muted-foreground">
            Mostre seu caminhão, sua equipe e como você cuida dos móveis dos clientes.
          </p>
        </div>

        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Foto</CardTitle>
            <CardDescription>Formatos aceitos: JPG, PNG. Máximo 5MB.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpload} className="space-y-4">
              {preview ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted">
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={() => setPreview(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative group border-2 border-dashed rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all">
                  <input 
                    type="file" 
                    name="photo" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                      <Camera className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold">Toque para tirar foto ou escolher arquivo</p>
                    <p className="text-xs text-muted-foreground mt-1">Sua foto aparecerá aqui antes de enviar</p>
                  </div>
                </div>
              )}

              <input 
                type="text" 
                name="caption" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Legenda (ex: Meu caminhão, equipe em ação...)" 
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              
              <Button 
                type="submit" 
                disabled={isPending || !preview}
                className="w-full h-12 gap-2 text-base font-bold shadow-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Adicionar à Galeria
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            Sua Galeria 
            <Badge variant="outline" className="font-mono">{photos.length}</Badge>
          </h2>

          {photos.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-[32px] text-muted-foreground bg-muted/30">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">Sua galeria ainda está vazia.</p>
              <p className="text-xs mt-1 text-muted-foreground/60">As fotos que você subir aparecerão aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border bg-muted shadow-sm">
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-white text-[11px] font-bold truncate">{photo.caption || "Sem legenda"}</p>
                    </div>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      onClick={() => handleRemove(photo.id, photo.url)}
                      className="h-8 w-8 rounded-full shadow-xl hover:scale-110 transition-transform shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
