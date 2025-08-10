import { useState } from 'react'
import { useActor } from '@/lib/agent'
import type { Section } from '@/types'

import { useModalStore } from '@/stores/useModalStore'
import { useTracksActions } from '@/hooks/useTracksActions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

export function CreateTrackPreset({ navigate }: { navigate: (route: string) => void }) {
  const { createTrack } = useTracksActions()
  const { close } = useModalStore()
  const kaiActor = useActor('kai_backend')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!kaiActor) return
    setLoading(true)
    setError(null)
    try {
      const result = await kaiActor.generateTrack(`Gere uma trilha sobre ${title}.${description ? `Sua descrição deve ser: ${description}` : ''}.`, [])
      if ('ok' in result) {
        const parsed = JSON.parse(JSON.parse(result.ok).candidates[0].content.parts[0].text.replaceAll('#', ''))
        const { title, description, sections } = parsed

        const id = await handleCreateTrack({ title, description, sections })

        navigate(`/tracks/${id}/edit`)
        close()
      } else {
        setError(result.err)
      }
    } catch (err) {
      setError('Failed to generate track.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrack = async ({ title, description, sections }: { title: string, description: string, sections: Section[] }) => {
    try {
      const id = await createTrack({
        title: title,
        description: description,
        sections: sections,
      })

      if (!id) {
        throw new Error('Failed to create track.')
      }

      return id
    } catch (err) {
      setError('Failed to save track.')
      console.error(err)
    }
  }

  return (
    <DialogContent className="max-w-xl" style={{ borderColor: 'var(--border)' }}>
      <DialogTitle className="text-2xl font-semibold">Create New Track</DialogTitle>
      <DialogDescription className="text-sm">Generate a track based on the information you provided.</DialogDescription>

      <div className="space-y-4 mt-4">
        <div className='flex flex-col gap-2'>
          <label className="text-sm font-medium">Name your track</label>
          <Input
            placeholder="E.g. Introduction to Blockchain"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-zinc-500">Be clear and specific. This will be the main name that everyone will see.</p>
        </div>

        <div className='flex flex-col gap-2'>
          <label className="text-sm font-medium">Description</label>
          <Input
            placeholder="Describe the main objective of this track, who it is for and what users will learn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-zinc-500">Tip: A good description increases engagement. Think about the prerequisites or the differentiator of your content.</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || title.trim() === ''}
          >
            {loading ? 'Creating track...' : 'Create'}
          </Button>
        </div>
      </div>
    </DialogContent >
  )
}
