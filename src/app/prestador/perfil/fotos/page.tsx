import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, ChevronLeft, Upload, Trash2, Plus, Camera } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function ProviderPhotosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get provider profile
  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch current photos
  const { data: photos } = await supabase
    .from("provider_photos")
    .select("*")
    .eq("provider_id", provider.id)
    .order("sort_order", { ascending: true });

  // Server Action to upload a photo
  async function uploadPhoto(formData: FormData) {
    "use server";
    const file = formData.get("photo") as File;
    const caption = formData.get("caption") as string;
    const supabase = await createClient();
    
    if (file && file.size > 0 && provider) {
      const fileName = `${provider.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error } = await supabase.storage
        .from("trabalhos")
        .upload(fileName, file);
      
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("trabalhos").getPublicUrl(fileName);
        
        await supabase.from("provider_photos").insert({
          provider_id: provider.id,
          url: publicUrl,
          caption: caption || "",
          sort_order: (photos?.length || 0) + 1
        });
        
        revalidatePath("/prestador/perfil/fotos");
      }
    }
  }

  // Server Action to remove a photo
  async function removePhoto(id: string, url: string) {
    "use server";
    const supabase = await createClient();
    
    // Extract path from public URL
    const path = url.split("/trabalhos/")[1];
    if (path) {
      await supabase.storage.from("trabalhos").remove([path]);
    }
    
    await supabase.from("provider_photos").delete().eq("id", id);
    revalidatePath("/prestador/perfil/fotos");
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Foto</CardTitle>
            <CardDescription>Formatos aceitos: JPG, PNG. Máximo 5MB.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={uploadPhoto} className="space-y-4">
              <div className="relative group border-2 border-dashed rounded-2xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all">
                <input 
                  type="file" 
                  name="photo" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                <p className="text-sm font-medium">Toque para tirar foto ou escolher arquivo</p>
              </div>
              <input 
                type="text" 
                name="caption" 
                placeholder="Legenda (ex: Meu caminhão, equipe em ação...)" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Adicionar à Galeria
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Sua Galeria ({photos?.length || 0})
          </h2>

          {photos?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-3xl text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Sua galeria ainda está vazia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {photos?.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border">
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs truncate flex-1 font-medium">{photo.caption}</p>
                    <form action={async () => {
                      "use server";
                      await removePhoto(photo.id, photo.url);
                    }}>
                      <Button size="icon" variant="destructive" className="h-8 w-8 rounded-lg shadow-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
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
