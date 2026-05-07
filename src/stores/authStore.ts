"use client";

import { create } from "zustand";

interface User {
  id: string;
  role: "client" | "provider" | "admin";
  full_name: string;
  phone: string;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, isLoading: false }),
}));
