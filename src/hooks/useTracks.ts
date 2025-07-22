import { useActor } from "@/lib/agent";
import { useTrackStore } from "@/store/useTrackStore";
import { toFrontendTrack, toMotokoTrack, toMotokoSection } from "@/lib/utils";
import { Track } from "@/types";

export function useTracks() {
  const tracksActor = useActor("tracks_backend");
  const { setTracks, setLoading, error, isLoading, setError, tracks } = useTrackStore();

  const fetchTracks = async () => {
    if (!tracksActor) return;
    setLoading(true);
    setError(null);

    try {
      const all = await tracksActor.listAllTracks();
      setTracks(all.map(toFrontendTrack));
    } catch (err) {
      console.error(err);
      setError("Falha ao buscar trilhas");
    } finally {
      setLoading(false);
    }
  };

  const getTrackById = async (id: string): Promise<Track | null> => {
    if (!tracksActor) return null;

    try {
      const result = await tracksActor.getTrackById(id);

      if (result.length === 0) {
        return null;
      }

      return toFrontendTrack(result[0]);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getTracksByAuthor = async (authorId: string): Promise<Track[]> => {
    if (!tracksActor) return [];

    try {
      const result = await tracksActor.getTracksByAuthor(authorId);
      return result.map(toFrontendTrack);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const createTrack = async (data: {
    title: string;
    description: string;
    sections: Track["sections"];
  }) => {
    if (!tracksActor) return;

    try {
      await tracksActor.createTrack(
        data.title,
        data.description,
        data.sections.map(toMotokoSection)
      );
      await fetchTracks(); // Atualiza lista no estado global
    } catch (err) {
      console.error(err);
      setError("Erro ao criar trilha");
    }
  };

  const updateTrack = async (track: Track) => {
    if (!tracksActor) return;

    try {
      await tracksActor.updateTrack(track.id, toMotokoTrack(track));
      await fetchTracks();
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar trilha");
    }
  };

  const deleteTrack = async (id: string) => {
    if (!tracksActor) return;

    try {
      await tracksActor.deleteTrack(id);
      await fetchTracks();
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar trilha");
    }
  };

  const injectSampleTracks = async () => {
    if (!tracksActor) return;
    setLoading(true);
    setError(null);

    try {
      await tracksActor.injectSampleTracks();
      const all = await tracksActor.listAllTracks();
      setTracks(all.map(toFrontendTrack));
    } catch (err) {
      console.error(err);
      setError("Falha ao injetar trilhas");
    } finally {
      setLoading(false);
    }
  };

  return {
    tracks,
    fetchTracks,
    injectSampleTracks,
    getTrackById,
    getTracksByAuthor,
    createTrack,
    updateTrack,
    deleteTrack,
    isLoading,
    error,
  };
}
