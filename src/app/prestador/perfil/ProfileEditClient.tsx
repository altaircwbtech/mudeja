'use client'

import { useState, useRef } from "react";
import { Camera, Loader2, Save, User, Phone, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateProfileAvatar, updateProfileData } from "./actions";

interface ProfileEditClientProps {
  profile: any;
  provider: any;
}

export default function ProfileEditClient({ profile, provider }: ProfileEditClientProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const result = await updateProfileAvatar(formData);
      if (result.success && result.avatar_url) {
        setAvatarUrl(result.avatar_url);
        toast.success("Foto de perfil atualizada!");
      } else {
        toast.error(result.error || "Erro ao subir foto");
      }
    } catch (error) {
      toast.error("Erro inesperado no upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updateProfileData(formData);
      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao atualizar dados");
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card className="border-none shadow-lg shadow-primary/5 overflow-hidden bg-white">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="h-32 w-32 rounded-[2.5rem] border-4 border-slate-50 bg-slate-100 flex items-center justify-center overflow-hidden shadow-xl transition-transform group-hover:scale-105 duration-300">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-16 w-16 text-slate-400" />
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-lg border-4 border-white group-hover:bg-primary/90 transition-colors">
              <Camera className="h-5 w-5" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold text-lg">Sua Foto de Rosto</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              Uma foto clara aumenta em 80% as chances de ser escolhido pelo cliente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-lg shadow-primary/5 bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Dados do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <label className="text-sm font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Como você atua?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'driver', label: 'Motorista', icon: '🚚', desc: 'Tenho veículo' },
                  { id: 'helper', label: 'Ajudante', icon: '🤝', desc: 'Mão de obra' },
                  { id: 'both', label: 'Ambos', icon: '🚛🤝', desc: 'Tenho tudo' },
                ].map((item) => (
                  <label 
                    key={item.id}
                    className={`
                      relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-slate-50
                      ${provider?.type === item.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 bg-white'}
                    `}
                  >
                    <input 
                      type="radio" 
                      name="type" 
                      value={item.id} 
                      defaultChecked={provider?.type === item.id}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="font-bold text-sm">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{item.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nome Completo
                </label>
                <Input 
                  name="fullName" 
                  defaultValue={profile.full_name} 
                  placeholder="Seu nome"
                  className="rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Nome da Empresa
                </label>
                <Input 
                  name="businessName" 
                  defaultValue={provider?.business_name} 
                  placeholder="Ex: Mudanças Silva"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                WhatsApp (Telefone)
              </label>
              <Input 
                name="phone" 
                defaultValue={profile.phone} 
                placeholder="(00) 00000-0000"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Sua Bio / Descrição
              </label>
              <Textarea 
                name="bio" 
                defaultValue={provider?.bio} 
                placeholder="Conte um pouco sobre sua experiência, cuidados com os móveis e equipamentos que possui..."
                className="min-h-[120px] rounded-xl resize-none"
              />
              <p className="text-[10px] text-muted-foreground">
                Dica: Mencione se possui mantas, carrinhos ou equipe própria.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
