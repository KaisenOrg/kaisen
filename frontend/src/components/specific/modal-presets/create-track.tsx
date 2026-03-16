import { useState } from 'react'
import { useActor } from '@/lib/agent'
import type { Content, Section } from '@/types'

import { useModalStore } from '@/stores/useModalStore'
import { useTracksActions } from '@/hooks/useTracksActions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

function parseEnvelopeText(payload: string): string {
  const envelope = JSON.parse(payload) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string
        }>
      }
    }>
  }

  return envelope.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

function parseJsonFromAiText(rawText: string): unknown {
  const markdownFenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  const withoutFence = (markdownFenceMatch?.[1] ?? rawText).trim()

  try {
    return JSON.parse(withoutFence)
  } catch {
    const objectStart = withoutFence.indexOf('{')
    const objectEnd = withoutFence.lastIndexOf('}')

    if (objectStart >= 0 && objectEnd > objectStart) {
      return JSON.parse(withoutFence.slice(objectStart, objectEnd + 1))
    }

    throw new Error('AI response did not contain valid JSON.')
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isGenericUnknownTitle(value: string): boolean {
  const normalized = value.toLowerCase().trim()
  return normalized === 'unknown' || normalized === 'unkown' || normalized === 'desconhecido'
}

function ensureNonEmptyText(value: string, fallback: string): string {
  return value.trim() === '' ? fallback : value
}

function normalizeSectionContent(content: unknown): Content {
  if (!isObject(content)) {
    return { Page: { title: '', content: '' } }
  }

  if ('Page' in content || 'Flashcard' in content || 'Quiz' in content || 'Essay' in content) {
    return content as Content
  }

  const type = typeof content.type === 'string' ? content.type : ''

  if (type === 'Page') {
    const pageTitle = normalizeText(content.title)
    const pageContent = normalizeText(content.content)
    const pageText = normalizeText((content as Record<string, unknown>).text)
    const pageBody = normalizeText((content as Record<string, unknown>).body)

    return {
      Page: {
        title: ensureNonEmptyText(pageTitle, 'Introdução'),
        content: ensureNonEmptyText(pageContent || pageText || pageBody, 'Conteúdo em preparação.'),
      },
    }
  }

  if (type === 'Flashcard') {
    const cards = Array.isArray(content.cards) ? content.cards : []
    const normalizedCards = cards
      .filter(isObject)
      .map((card) => ({
        sentence: normalizeText(card.sentence),
        answer: normalizeText(card.answer),
      }))
      .filter((card) => card.sentence !== '' && card.answer !== '')

    if (normalizedCards.length === 0) {
      return {
        Page: {
          title: 'Resumo',
          content: 'Conteúdo em preparação.',
        },
      }
    }

    return {
      Flashcard: normalizedCards,
    }
  }

  if (type === 'Quiz') {
    const questions = Array.isArray(content.questions) ? content.questions : []
    const normalizedQuestions = questions
      .filter(isObject)
      .map((question) => {
        const alternatives = Array.isArray(question.alternatives) ? question.alternatives : []
        const normalizedAlternatives = alternatives
          .filter(isObject)
          .map((alternative, index) => ({
            id:
              typeof alternative.id === 'number'
                ? alternative.id
                : Number.isFinite(Number(alternative.id))
                  ? Number(alternative.id)
                  : index + 1,
            text: normalizeText(alternative.text),
          }))
          .filter((alternative) => alternative.text !== '')

        const correctAnswerIdRaw =
          typeof question.correctAnswerId === 'number'
            ? question.correctAnswerId
            : Number.isFinite(Number(question.correctAnswerId))
              ? Number(question.correctAnswerId)
              : 1

        return {
          question: normalizeText(question.question),
          alternatives: normalizedAlternatives,
          correctAnswerId:
            normalizedAlternatives.some((alternative) => alternative.id === correctAnswerIdRaw)
              ? correctAnswerIdRaw
              : normalizedAlternatives[0]?.id ?? 1,
        }
      })
      .filter((question) => question.question !== '' && question.alternatives.length > 0)

    if (normalizedQuestions.length === 0) {
      return {
        Page: {
          title: 'Resumo',
          content: 'Conteúdo em preparação.',
        },
      }
    }

    return {
      Quiz: normalizedQuestions,
    }
  }

  if (type === 'Essay') {
    const questions = Array.isArray(content.questions) ? content.questions : []
    const normalizedQuestions = questions
      .filter(isObject)
      .map((question) => ({
        question: normalizeText(question.question),
        expectedAnswer: normalizeText(question.expectedAnswer),
      }))
      .filter((question) => question.question !== '' && question.expectedAnswer !== '')

    if (normalizedQuestions.length === 0) {
      return {
        Page: {
          title: 'Resumo',
          content: 'Conteúdo em preparação.',
        },
      }
    }

    return {
      Essay: normalizedQuestions,
    }
  }

  return { Page: { title: '', content: '' } }
}

function normalizeTrackPayload(parsed: unknown, fallbackTitle: string, fallbackDescription: string) {
  if (!isObject(parsed)) {
    throw new Error('Invalid AI payload for track generation.')
  }

  const sectionsRaw = Array.isArray(parsed.sections) ? parsed.sections : []

  const sections: Section[] = sectionsRaw
    .filter(isObject)
    .map((section, index) => ({
      id:
        typeof section.id === 'number'
          ? section.id
          : Number.isFinite(Number(section.id))
            ? Number(section.id)
            : index + 1,
      title:
        normalizeText(section.title) !== ''
          ? normalizeText(section.title)
          : `Section ${index + 1}`,
      content: normalizeSectionContent(section.content),
    }))

  if (sections.length === 0) {
    throw new Error('AI generated no sections for this track.')
  }

  const parsedTitle = normalizeText(parsed.title)
  const parsedDescription = normalizeText(parsed.description)
  const safeFallbackTitle = ensureNonEmptyText(normalizeText(fallbackTitle), 'Nova Trilha')
  const safeFallbackDescription = ensureNonEmptyText(
    normalizeText(fallbackDescription),
    'Trilha gerada automaticamente.',
  )

  return {
    title:
      parsedTitle !== '' && !isGenericUnknownTitle(parsedTitle)
        ? parsedTitle
        : safeFallbackTitle,
    description: parsedDescription !== '' ? parsedDescription : safeFallbackDescription,
    sections,
  }
}

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
        const aiText = parseEnvelopeText(result.ok)
        const parsed = parseJsonFromAiText(aiText)
        const normalizedTrack = normalizeTrackPayload(parsed, title, description)

        const id = await createTrack({
          title: normalizedTrack.title,
          description: normalizedTrack.description,
          sections: normalizedTrack.sections,
        })

        if (!id) {
          setError('Failed to save track.')
          return
        }

        navigate(`/tracks/${id}/edit`)
        close()
      } else {
        setError(result.err)
        console.error(result.err)
      }
    } catch (err) {
      setError('Failed to generate track.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-xl" style={{ borderColor: 'var(--border)' }}>
      <DialogTitle className="text-2xl font-semibold">Create New Track</DialogTitle>
      <DialogDescription className="text-zinc-500">Create a new track to start learning.</DialogDescription>

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
