// store/useTrackStore.ts
import { create } from "zustand";
import { Track } from "@/types";

interface TrackStore {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;

  setTracks: (tracks: Track[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useTrackStore = create<TrackStore>((set) => ({
  tracks: [],
  isLoading: false,
  error: null,
  setTracks: (tracks) => set({ tracks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clear: () => set({ tracks: [], isLoading: false, error: null }),
}));
