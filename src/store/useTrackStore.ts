import { create } from 'zustand';
import type { ActorSubclass } from '@dfinity/agent';
import type { _SERVICE as TracksService } from '@/declarations/tracks_backend/tracks_backend.did';
import type { Track } from '@/declarations/tracks_backend/tracks_backend.did';

interface TrackState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  fetchTracks: (tracksActor: ActorSubclass<TracksService>) => Promise<void>;
  injectSampleTracks: (tracksActor: ActorSubclass<TracksService>) => Promise<void>;
}

export const useTrackStore = create<TrackState>((set) => ({
  tracks: [],
  isLoading: false,
  error: null,


  /**
   * @notice Busca todas as trilhas do canister e atualiza o estado.
   */
  fetchTracks: async (tracksActor) => {
    set({ isLoading: true, error: null });
    try {
      const allTracks = await tracksActor.listAllTracks();
      set({ tracks: allTracks, isLoading: false });
    } catch (err) {
      console.error("Erro ao buscar trilhas:", err);
      set({ error: "Falha ao carregar as trilhas.", isLoading: false });
    }
  },

  /**
   * @notice Chama a função de injeção de dados de exemplo e atualiza a lista.
   */
  injectSampleTracks: async (tracksActor) => {
    set({ isLoading: true, error: null });
    try {
      // Chama a função de injeção no backend
      await tracksActor.injectSampleTracks();
      // Após injetar, busca a lista atualizada de trilhas
      const allTracks = await tracksActor.listAllTracks();
      set({ tracks: allTracks, isLoading: false });
    } catch (err) {
      console.error("Erro ao injetar trilhas de exemplo:", err);
      set({ error: "Falha ao injetar dados.", isLoading: false });
    }
  },
}));