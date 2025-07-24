import { create } from "zustand";
import type { UserData } from "@/types";

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
  setError: (error: string | null) => void;
  error: string | null;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setError: (error) => set({ error }),
  error: null,
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
