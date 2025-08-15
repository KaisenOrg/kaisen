import { useActor } from '@/lib/agent'
import { useTrackStore } from '@/stores/useTrackStore'
import { toFrontendTrack, toMotokoTrack, toMotokoSection } from '@/lib/mappers'
import type { Section, Track } from '@/types'

export function useTracksActions() {
  const tracksActor = useActor('tracks_backend')
  const { setTracks, setLoading, setError, clear } = useTrackStore()

  const fetchTracks = async () => {
    if (!tracksActor) return
    setLoading(true)
    try {
      const res = await tracksActor.listAllTracks()
      setTracks(res.map(toFrontendTrack))
      console.log(res.map(toFrontendTrack).map(t => t.sections))
    } catch (err) {
      console.error(err)
      setError('Falha ao buscar trilhas')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrackById = async (id: string) => {
    if (!tracksActor) return
    setLoading(true)
    try {
      const res = await tracksActor.getTrackById(id)

      if (res.length === 0) return

      return toFrontendTrack(res[0])
    } catch (err) {
      console.error(err)
      setError('Falha ao buscar trilha')
    } finally {
      setLoading(false)
    }
  }

  const fetchTracksByAuthor = async (author: string) => {
    if (!tracksActor) return
    setLoading(true)
    try {
      const res = await tracksActor.getTracksByAuthor(author)

      if (res.length === 0) return []

      return res.map(toFrontendTrack)
    } catch (err) {
      console.error(err)
      setError('Falha ao buscar trilhas')
    } finally {
      setLoading(false)
    }
  }

  const createTrack = async (data: { title: string; description: string; sections: Track['sections'] }) => {
    if (!tracksActor) return
    setLoading(true)
    try {
      const res = await tracksActor.createTrack(data.title, data.description, data.sections.map(toMotokoSection))

      if ('err' in res) {
        setError(res.err)
        return
      }

      await fetchTracks()

      return res.ok
    } catch (err) {
      console.error(err)
      setError('Erro ao criar trilha')
    } finally {
      setLoading(false)
    }
  }

  const updateTrack = async (track: Track) => {
    if (!tracksActor) return
    setLoading(true)
    try {
      await tracksActor.updateTrack(track.id, toMotokoTrack(track))
      await fetchTracks()
    } catch (err) {
      console.error(err)
      setError('Erro ao atualizar trilha')
    } finally {
      setLoading(false)
    }
  }

  const updateSection = async (sectionId: number, trackId: string, updatedSection: Section) => {
    if (!tracksActor) return
    setLoading(true)
    try {
      await tracksActor.updateSection(BigInt(sectionId), trackId, toMotokoSection(updatedSection))
      await fetchTracks()
    } catch (err) {
      console.error(err)
      setError('Erro ao atualizar seção')
    } finally {
      setLoading(false)
    }
  }

  const deleteTrack = async (id: string) => {
    if (!tracksActor) return
    setLoading(true)
    try {
      await tracksActor.deleteTrack(id)
      await fetchTracks()
    } catch (err) {
      console.error(err)
      setError('Erro ao deletar trilha')
    } finally {
      setLoading(false)
    }
  }

  const injectSampleTracks = async () => {
    if (!tracksActor) return
    setLoading(true)
    try {
      await tracksActor.injectSampleTracks()
      await fetchTracks()
    } catch (err) {
      console.error(err)
      setError('Erro ao injetar trilhas')
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchTracks,
    createTrack,
    updateTrack,
    updateSection,
    deleteTrack,
    fetchTrackById,
    fetchTracksByAuthor,
    injectSampleTracks,
    clear
  }
}
