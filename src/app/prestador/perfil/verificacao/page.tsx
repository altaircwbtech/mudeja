import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ChevronLeft, Camera, FileText, Upload, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function VerificationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get provider profile
  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Status computation
  const isVerified = provider.selfie_verified && provider.document_verified;
  const isPending = (provider.selfie_url || provider.document_url) && !isVerified;

  async function uploadVerification(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const selfieFile = formData.get("selfie") as File;
    const documentFile = formData.get("document") as File;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates: any = {};

    if (selfieFile && selfieFile.size > 0) {
      const fileName = `selfie_${user.id}_${Date.now()}.jpg`;
      const { data: uploadData, error } = await supabase.storage
        .from("verificacoes")
        .upload(fileName, selfieFile);
      
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("verificacoes").getPublicUrl(fileName);
        updates.selfie_url = publicUrl;
      }
    }

    if (documentFile && documentFile.size > 0) {
      const fileName = `doc_${user.id}_${Date.now()}.jpg`;
      const { data: uploadData, error } = await supabase.storage
        .from("verificacoes")
        .upload(fileName, documentFile);
      
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("verificacoes").getPublicUrl(fileName);
        updates.document_url = publicUrl;
      }
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from("providers").update(updates).eq("user_id", user.id);
      revalidatePath("/prestador/perfil/verificacao");
      revalidatePath("/prestador");
    }
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
            <ShieldCheck className="h-6 w-6 text-primary" />
            Verificação de Identidade
          </h1>
          <p className="text-muted-foreground">
            Aumente sua confiança e consiga mais clientes com o selo de verificado.
          </p>
        </div>

        {isVerified ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-green-900">Perfil Verificado!</h2>
              <p className="text-green-700 mt-1">Sua identidade foi confirmada. O selo já aparece para seus clientes.</p>
            </CardContent>
          </Card>
        ) : isPending ? (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <AlertCircle className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-orange-900">Em Análise</h2>
              <p className="text-orange-700 mt-1">Recebemos seus documentos. Nossa equipe vai validar em até 24h.</p>
            </CardContent>
          </Card>
        ) : (
          <form action={uploadVerification} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  Sua Selfie
                </CardTitle>
                <CardDescription>
                  Tire uma foto clara do seu rosto. Evite óculos de sol ou chapéus.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    name="selfie" 
                    accept="image/*" 
                    capture="user"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="border-2 border-dashed rounded-2xl p-8 text-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                    <p className="text-sm font-medium">Clique para tirar foto ou selecionar</p>
                    <p className="text-xs text-muted-foreground mt-1">Formato JPG ou PNG</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Documento (RG ou CNH)
                </CardTitle>
                <CardDescription>
                  Envie uma foto da frente do seu documento aberto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    name="document" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="border-2 border-dashed rounded-2xl p-8 text-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                    <p className="text-sm font-medium">Clique para selecionar foto do documento</p>
                    <p className="text-xs text-muted-foreground mt-1">Frente do documento legível</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg">
              Enviar para Verificação
            </Button>
          </form>
        )}

        <div className="mt-8 p-6 bg-zinc-50 border rounded-3xl">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Por que verificar?
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Conquiste a confiança dos clientes mais rápido</li>
            <li>• Apareça no topo das buscas</li>
            <li>• Receba o selo de "Parceiro Verificado"</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
