"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRequest } from "@/lib/request-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Briefcase,
  Truck,
  Plus,
  Minus,
  Trash2,
  Info,
  Package,
  MapPin,
  Calendar,
  ArrowRight,
  Loader2,
  Building2,
  Users2,
} from "lucide-react";

const SERVICE_TYPES = [
  { id: "mudanca_residencial", label: "Mudança Residencial", icon: Home, desc: "Casa ou apartamento completo" },
  { id: "mudanca_comercial", label: "Mudança Comercial", icon: Briefcase, desc: "Escritório ou loja" },
  { id: "carreto", label: "Carreto", icon: Truck, desc: "Poucos itens, trajeto curto" },
  { id: "frete_pequeno", label: "Frete Pequeno", icon: Package, desc: "Apenas 1 ou 2 móveis/eletros" },
];

const MOVE_SIZES = [
  { id: "pequeno", label: "Pequeno (1 cômodo)" },
  { id: "medio", label: "Médio (2 a 3 cômodos)" },
  { id: "grande", label: "Grande (4+ cômodos)" },
];

const COMMON_ITEMS = [
  { id: 'geladeira', label: 'Geladeira', icon: '❄️' },
  { id: 'fogao', label: 'Fogão', icon: '🔥' },
  { id: 'maquina_lavar', label: 'Máquina de Lavar', icon: '🧺' },
  { id: 'sofa', label: 'Sofá', icon: '🛋️' },
  { id: 'cama_casal', label: 'Cama Casal', icon: '🛏️' },
  { id: 'mesa_jantar', label: 'Mesa de Jantar', icon: '🍽️' },
  { id: 'guarda_roupa', label: 'Guarda-roupa', icon: '👗' },
  { id: 'caixa', label: 'Caixas de Mudança', icon: '📦' },
  { id: 'tv', label: 'Televisão', icon: '📺' },
];

const STORAGE_KEY = "movafacil_request_draft";

export function RequestForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    service_type: "",
    move_size: "",
    origin_city: "",
    origin_state: "PR",
    origin_neighborhood: "",
    origin_residence_type: "casa",
    origin_has_elevator: false,
    origin_floor: 0,
    dest_city: "",
    dest_state: "PR",
    dest_neighborhood: "",
    dest_residence_type: "casa",
    dest_has_elevator: false,
    dest_floor: 0,
    desired_date: "",
    is_date_flexible: true,
    needs_packing: false,
    needs_assembly: false,
    needs_helper: false,
    client_has_helpers: false,
    client_helpers_count: 0,
    description: "",
  });

  const [items, setItems] = useState<any[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { formData: savedForm, items: savedItems, step: savedStep } = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...savedForm }));
        setItems(savedItems || []);
        setStep(savedStep || 1);
      } catch (e) {
        console.error("Error loading draft", e);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, items, step }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData, items, step]);

  const addItem = (item: any) => {
    const existing = items.find(i => i.name === item.label);
    if (existing) {
      setItems(items.map(i => i.name === item.label ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { 
        name: item.label, 
        quantity: 1, 
        needs_disassembly: false, 
        is_fragile: false,
        icon: item.icon
      }]);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' && value <= 0) {
      newItems.splice(index, 1);
    }
    setItems(newItems);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value.toString());
    });

    // Append items as JSON
    formDataObj.append("items", JSON.stringify(items));

    const result = await createRequest(formDataObj);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      router.push("/cliente?success=request_created");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              s <= step ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* STEP 1: Service Type */}
      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Qual serviço você precisa?</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Selecione a opção que melhor descreve sua necessidade hoje.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, service_type: type.id });
                  setStep(2);
                }}
                className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all group ${
                  formData.service_type === type.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-slate-100 bg-white hover:border-primary/40 hover:bg-slate-50"
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  formData.service_type === type.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{type.label}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-tight">
                    {type.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Addresses and Details */}
      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Locais e Detalhes da Residência</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Informe o tipo de local e o andar para um orçamento preciso.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Origin */}
            <Card className="border-none bg-orange-50/50 shadow-sm overflow-hidden">
              <div className="h-1 bg-orange-200" />
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-orange-700">
                  <MapPin className="h-4 w-4" />
                  Origem (Retirada)
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, origin_residence_type: 'casa' })}
                    className={`flex items-center justify-center gap-2 p-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      formData.origin_residence_type === 'casa' ? 'border-orange-500 bg-white text-orange-700' : 'border-transparent bg-orange-100/50 text-orange-400'
                    }`}
                  >
                    <Home className="h-3 w-3" /> Casa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, origin_residence_type: 'apartamento' })}
                    className={`flex items-center justify-center gap-2 p-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      formData.origin_residence_type === 'apartamento' ? 'border-orange-500 bg-white text-orange-700' : 'border-transparent bg-orange-100/50 text-orange-400'
                    }`}
                  >
                    <Building2 className="h-3 w-3" /> Apto
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-orange-700/60">Cidade</Label>
                      <Input
                        value={formData.origin_city}
                        onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                        placeholder="Cidade"
                        className="rounded-xl border-orange-100 focus-visible:ring-orange-200 h-9 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-orange-700/60">Bairro</Label>
                      <Input
                        value={formData.origin_neighborhood}
                        onChange={(e) => setFormData({ ...formData, origin_neighborhood: e.target.value })}
                        placeholder="Bairro"
                        className="rounded-xl border-orange-100 focus-visible:ring-orange-200 h-9 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {formData.origin_residence_type === 'apartamento' && (
                  <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-orange-700/60">Andar</Label>
                      <Input
                        type="number"
                        value={formData.origin_floor}
                        onChange={(e) => setFormData({ ...formData, origin_floor: parseInt(e.target.value) || 0 })}
                        className="rounded-xl border-orange-100 h-9 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <Checkbox
                        id="origin_elevator"
                        checked={formData.origin_has_elevator}
                        onCheckedChange={(c) => setFormData({ ...formData, origin_has_elevator: !!c })}
                        className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      />
                      <Label htmlFor="origin_elevator" className="text-xs font-bold text-orange-900 leading-none">Elevador</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Destination */}
            <Card className="border-none bg-blue-50/50 shadow-sm overflow-hidden">
              <div className="h-1 bg-blue-200" />
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 font-bold text-blue-700">
                  <MapPin className="h-4 w-4" />
                  Destino (Entrega)
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dest_residence_type: 'casa' })}
                    className={`flex items-center justify-center gap-2 p-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      formData.dest_residence_type === 'casa' ? 'border-blue-500 bg-white text-blue-700' : 'border-transparent bg-blue-100/50 text-blue-400'
                    }`}
                  >
                    <Home className="h-3 w-3" /> Casa
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dest_residence_type: 'apartamento' })}
                    className={`flex items-center justify-center gap-2 p-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      formData.dest_residence_type === 'apartamento' ? 'border-blue-500 bg-white text-blue-700' : 'border-transparent bg-blue-100/50 text-blue-400'
                    }`}
                  >
                    <Building2 className="h-3 w-3" /> Apto
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-blue-700/60">Cidade</Label>
                      <Input
                        value={formData.dest_city}
                        onChange={(e) => setFormData({ ...formData, dest_city: e.target.value })}
                        placeholder="Cidade"
                        className="rounded-xl border-blue-100 focus-visible:ring-blue-200 h-9 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-blue-700/60">Bairro</Label>
                      <Input
                        value={formData.dest_neighborhood}
                        onChange={(e) => setFormData({ ...formData, dest_neighborhood: e.target.value })}
                        placeholder="Bairro"
                        className="rounded-xl border-blue-100 focus-visible:ring-blue-200 h-9 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {formData.dest_residence_type === 'apartamento' && (
                  <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-blue-700/60">Andar</Label>
                      <Input
                        type="number"
                        value={formData.dest_floor}
                        onChange={(e) => setFormData({ ...formData, dest_floor: parseInt(e.target.value) || 0 })}
                        className="rounded-xl border-blue-100 h-9 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <Checkbox
                        id="dest_elevator"
                        checked={formData.dest_has_elevator}
                        onCheckedChange={(c) => setFormData({ ...formData, dest_has_elevator: !!c })}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor="dest_elevator" className="text-xs font-bold text-blue-900 leading-none">Elevador</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold flex items-center gap-2 text-slate-900">
              <Calendar className="h-4 w-4 text-primary" /> Data da Mudança
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Data preferencial</Label>
                <Input
                  type="date"
                  value={formData.desired_date}
                  onChange={(e) => setFormData({ ...formData, desired_date: e.target.value })}
                  className="rounded-xl h-11 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <Checkbox
                    id="flexible"
                    checked={formData.is_date_flexible}
                    onCheckedChange={(c) => setFormData({ ...formData, is_date_flexible: !!c })}
                  />
                </div>
                <Label htmlFor="flexible" className="text-sm font-medium leading-tight cursor-pointer">
                  Tenho flexibilidade de 2 a 3 dias <span className="block text-xs text-slate-500 font-normal mt-0.5">(Isso ajuda a conseguir preços melhores)</span>
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Visual Inventory */}
      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">O que vamos levar? 📦</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione os itens para um orçamento 100% certeiro.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary font-bold">
              {items.reduce((acc, i) => acc + i.quantity, 0)} Itens
            </Badge>
          </div>

          <div className="space-y-4">
             <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Sugestões de Itens</Label>
             <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {COMMON_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-white hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-4 border-t pt-8">
             <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Itens na sua Mudança</Label>
             {items.length === 0 ? (
               <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                  <Package className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">Clique acima para adicionar itens ao seu inventário.</p>
               </div>
             ) : (
               <div className="grid gap-3">
                 {items.map((item, idx) => (
                   <Card key={idx} className="border-slate-100 shadow-sm overflow-hidden group">
                     <CardContent className="p-4 flex items-center gap-4">
                        <span className="text-2xl h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center">{item.icon || '📦'}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <div className="flex gap-4 mt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <Checkbox 
                                checked={item.needs_disassembly} 
                                onCheckedChange={(c) => updateItem(idx, 'needs_disassembly', !!c)}
                                className="h-3.5 w-3.5"
                              />
                              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Desmontagem</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <Checkbox 
                                checked={item.is_fragile} 
                                onCheckedChange={(c) => updateItem(idx, 'is_fragile', !!c)}
                                className="h-3.5 w-3.5"
                              />
                              <span className="text-[10px] font-medium text-amber-600 uppercase tracking-wide">Frágil</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-white hover:text-rose-500"
                            onClick={() => updateItem(idx, 'quantity', item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary"
                            onClick={() => updateItem(idx, 'quantity', item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* STEP 4: Details */}
      {step === 4 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tamanho e Equipe</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Finalize informando quem ajudará no carregamento.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Volume da Mudança</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {MOVE_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, move_size: size.id })}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                    formData.move_size === size.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-slate-100 bg-white hover:border-primary/40"
                  }`}
                >
                  <span className="block font-bold text-sm">{size.label}</span>
                  {formData.move_size === size.id && (
                    <div className="absolute top-2 right-2 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                       <CheckIcon className="h-2 w-2 text-white stroke-[4]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-8">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Equipe de Apoio</Label>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Terei pessoas para ajudar</p>
                    <p className="text-xs text-slate-500">Amigos ou familiares que ajudarão a carregar.</p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.client_has_helpers}
                  onCheckedChange={(c) => setFormData({ ...formData, client_has_helpers: !!c })}
                  className="h-6 w-6 rounded-lg"
                />
              </div>

              {formData.client_has_helpers && (
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between animate-in slide-in-from-top-2">
                  <Label className="font-bold text-primary">Quantas pessoas vão ajudar?</Label>
                  <div className="flex items-center gap-3 bg-white rounded-xl p-1 border border-primary/20">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setFormData({ ...formData, client_helpers_count: Math.max(0, formData.client_helpers_count - 1) })}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-black text-sm w-4 text-center">{formData.client_helpers_count}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setFormData({ ...formData, client_helpers_count: formData.client_helpers_count + 1 })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t pt-8">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Serviços do Profissional</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className={`
                flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all
                ${formData.needs_helper ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:bg-slate-50'}
              `}>
                <Checkbox
                  checked={formData.needs_helper}
                  onCheckedChange={(c) => setFormData({ ...formData, needs_helper: !!c })}
                />
                <span className="text-sm font-bold">Ajudante(s)</span>
              </label>
              <label className={`
                flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all
                ${formData.needs_packing ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:bg-slate-50'}
              `}>
                <Checkbox
                  checked={formData.needs_packing}
                  onCheckedChange={(c) => setFormData({ ...formData, needs_packing: !!c })}
                />
                <span className="text-sm font-bold">Embalagem</span>
              </label>
              <label className={`
                flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all
                ${formData.needs_assembly ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:bg-slate-50'}
              `}>
                <Checkbox
                  checked={formData.needs_assembly}
                  onCheckedChange={(c) => setFormData({ ...formData, needs_assembly: !!c })}
                />
                <span className="text-sm font-bold">Montagem</span>
              </label>
            </div>
          </div>

          <div className="space-y-4 border-t pt-8">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Informações Extras</Label>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Opcional</span>
            </div>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Tenho pressa, o condomínio só libera o elevador das 9h às 16h, etc..."
              className="min-h-[140px] rounded-2xl border-slate-200 focus-visible:ring-primary/20 resize-none"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t pt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep(step - 1)}
          disabled={step === 1 || loading}
          className="h-12 px-8 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
        >
          Voltar
        </Button>
        
        <Button
          type="submit"
          className="h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/25 min-w-[160px] transition-all hover:scale-[1.02]"
          disabled={loading || (step === 1 && !formData.service_type) || (step === 4 && !formData.move_size)}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publicando...</>
          ) : step === 4 ? (
            "Publicar Agora 🚀"
          ) : (
            <><span className="mr-2">Próximo Passo</span> <ArrowRight className="h-5 w-5" /></>
          )}
        </Button>
      </div>
    </form>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
