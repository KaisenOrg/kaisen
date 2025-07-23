import { useActor } from "@/lib/agent";
import { useTrackStore } from "@/store/useTrackStore";
import { toFrontendTrack, toMotokoTrack, toMotokoSection } from "@/lib/utils";
import { Track } from "@/types";

export function useTracksActions() {
  const tracksActor = useActor("tracks_backend");
  const { setTracks, setLoading, setError, clear } = useTrackStore();

  const fetchTracks = async () => {
    if (!tracksActor) return;
    setLoading(true);
    try {
      const res = await tracksActor.listAllTracks();
      setTracks(res.map(toFrontendTrack));
    } catch (err) {
      console.error(err);
      setError("Falha ao buscar trilhas");
    } finally {
      setLoading(false);
    }
  };

  const createTrack = async (data: { title: string; description: string; sections: Track["sections"] }) => {
    if (!tracksActor) return;
    setLoading(true);
    try {
      await tracksActor.createTrack(data.title, data.description, data.sections.map(toMotokoSection));
      await fetchTracks();
    } catch (err) {
      console.error(err);
      setError("Erro ao criar trilha");
    } finally {
      setLoading(false);
    }
  };

  const updateTrack = async (track: Track) => {
    if (!tracksActor) return;
    setLoading(true);
    try {
      await tracksActor.updateTrack(track.id, toMotokoTrack(track));
      await fetchTracks();
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar trilha");
    } finally {
      setLoading(false);
    }
  };

  const deleteTrack = async (id: string) => {
    if (!tracksActor) return;
    setLoading(true);
    try {
      await tracksActor.deleteTrack(id);
      await fetchTracks();
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar trilha");
    } finally {
      setLoading(false);
    }
  };

  const injectSampleTracks = async () => {
    if (!tracksActor) return;
    setLoading(true);
    try {
      await tracksActor.injectSampleTracks();
      await fetchTracks();
    } catch (err) {
      console.error(err);
      setError("Erro ao injetar trilhas");
    } finally {
      setLoading(false);
    }
  };

  return { fetchTracks, createTrack, updateTrack, deleteTrack, injectSampleTracks, clear };
}
