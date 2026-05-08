"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSearchClient() {
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      router.push(`/explorar?city=${encodeURIComponent(city.trim())}`);
    } else {
      router.push("/explorar");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-xl group">
      {/* Efeito de brilho no hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-[2rem] shadow-2xl border border-slate-100">
        <div className="flex-1 flex items-center px-4 gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <input 
            type="text" 
            placeholder="Em qual cidade você está?" 
            className="w-full bg-transparent border-none outline-none text-slate-900 font-medium placeholder:text-slate-400 h-12"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <Button 
          type="submit"
          size="lg" 
          className="h-14 px-8 text-lg font-bold rounded-[1.5rem] shadow-xl shadow-primary/30 group"
        >
          Buscar Agora
          <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  );
}
