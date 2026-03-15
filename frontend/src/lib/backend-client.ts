import { Principal } from '@dfinity/principal'
import { loadIdentity } from '@/storage'

type MotokoUser = {
  picture: [] | [string]
  nickname: string
  username: string
  about: [] | [string]
  role: [] | [string]
  followers: { userIdentity: string; timestamp: bigint }[]
  following: string[]
  certificates: string[]
  createdTracks: string[]
  inProgressTracks: { id: string; progress: number }[]
  completedTracks: string[]
  principal: Principal
  identity: string
}

type MotokoContent =
  | { Page: { title: string; content: string } }
  | { Flashcard: Array<{ sentence: string; answer: string }> }
  | { Quiz: Array<{ question: string; alternatives: Array<{ id: bigint; text: string }>; correctAnswerId: bigint }> }
  | { Essay: Array<{ question: string; expectedAnswer: string }> }

type MotokoSection = {
  id: bigint
  title: string
  content: MotokoContent
}

type MotokoTrack = {
  id: string
  title: string
  description: string
  authorId: string
  createdAt: bigint
  sections: MotokoSection[]
}

type BackendSectionContent =
  | { type: 'Page'; title: string; content: string }
  | { type: 'Flashcard'; cards: Array<{ sentence: string; answer: string }> }
  | {
      type: 'Quiz'
      questions: Array<{
        question: string
        alternatives: Array<{ id: number; text: string }>
        correctAnswerId: number
      }>
    }
  | {
      type: 'Essay'
      questions: Array<{ question: string; expectedAnswer: string }>
    }

type BackendSection = {
  id: number
  title: string
  content: BackendSectionContent
}

type BackendTrack = {
  id: string
  title: string
  description: string
  authorId: string
  createdAt: string
  sections: BackendSection[]
}

type BackendUser = {
  identity: string
  picture: string | null
  nickname: string
  username: string
  about: string | null
  role: string | null
  followers: { userIdentity: string; timestamp: string }[]
  following: string[]
  certificates: string[]
  createdTracks: string[]
  inProgressTracks: { id: string; progress: number }[]
  completedTracks: string[]
}

type BackendCertificate = {
  id: string
  owner: string
  trackName: string
  svg: string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '/api'
const KOIN_STORAGE_KEY = 'kaisen.local.koin.v1'
const DEFAULT_BALANCE = 0n

function getCurrentIdentityText() {
  return loadIdentity()?.getPrincipal().toText() ?? 'local-dev-user'
}

function opt<T>(value?: T | null): [] | [T] {
  return value ? [value] : []
}

function parsePrincipal(identity: string) {
  try {
    return Principal.fromText(identity)
  } catch {
    return Principal.anonymous()
  }
}

function extractErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const payload = await response.json()
      message = typeof payload.message === 'string' ? payload.message : JSON.stringify(payload.message)
    } catch {
      message = await response.text()
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function toBackendSection(section: MotokoSection): BackendSection {
  const { content } = section

  if ('Page' in content) {
    return {
      id: Number(section.id),
      title: section.title,
      content: {
        type: 'Page',
        title: content.Page.title,
        content: content.Page.content,
      },
    }
  }

  if ('Flashcard' in content) {
    return {
      id: Number(section.id),
      title: section.title,
      content: {
        type: 'Flashcard',
        cards: content.Flashcard,
      },
    }
  }

  if ('Quiz' in content) {
    return {
      id: Number(section.id),
      title: section.title,
      content: {
        type: 'Quiz',
        questions: content.Quiz.map((question) => ({
          question: question.question,
          alternatives: question.alternatives.map((alternative) => ({
            id: Number(alternative.id),
            text: alternative.text,
          })),
          correctAnswerId: Number(question.correctAnswerId),
        })),
      },
    }
  }

  return {
    id: Number(section.id),
    title: section.title,
    content: {
      type: 'Essay',
      questions: content.Essay,
    },
  }
}

function toMotokoSection(section: BackendSection): MotokoSection {
  const { content } = section

  if (content.type === 'Page') {
    return {
      id: BigInt(section.id),
      title: section.title,
      content: {
        Page: {
          title: content.title,
          content: content.content,
        },
      },
    }
  }

  if (content.type === 'Flashcard') {
    return {
      id: BigInt(section.id),
      title: section.title,
      content: {
        Flashcard: content.cards,
      },
    }
  }

  if (content.type === 'Quiz') {
    return {
      id: BigInt(section.id),
      title: section.title,
      content: {
        Quiz: content.questions.map((question) => ({
          question: question.question,
          alternatives: question.alternatives.map((alternative) => ({
            id: BigInt(alternative.id),
            text: alternative.text,
          })),
          correctAnswerId: BigInt(question.correctAnswerId),
        })),
      },
    }
  }

  return {
    id: BigInt(section.id),
    title: section.title,
    content: {
      Essay: content.questions,
    },
  }
}

function toMotokoTrack(track: BackendTrack): MotokoTrack {
  return {
    id: track.id,
    title: track.title,
    description: track.description,
    authorId: track.authorId,
    createdAt: BigInt(new Date(track.createdAt).getTime()),
    sections: track.sections.map(toMotokoSection),
  }
}

function toBackendUser(user: MotokoUser) {
  return {
    identity: user.identity,
    picture: user.picture[0] ?? null,
    nickname: user.nickname,
    username: user.username,
    about: user.about[0] ?? null,
    role: user.role[0] ?? null,
    followers: user.followers.map((follower) => ({
      userIdentity: follower.userIdentity,
      timestamp: new Date(Number(follower.timestamp)).toISOString(),
    })),
    following: user.following,
    certificates: user.certificates,
    createdTracks: user.createdTracks,
    inProgressTracks: user.inProgressTracks,
    completedTracks: user.completedTracks,
  }
}

function toMotokoUser(user: BackendUser): MotokoUser {
  return {
    picture: opt(user.picture),
    nickname: user.nickname,
    username: user.username,
    about: opt(user.about),
    role: opt(user.role),
    followers: user.followers.map((follower) => ({
      userIdentity: follower.userIdentity,
      timestamp: BigInt(new Date(follower.timestamp).getTime()),
    })),
    following: user.following,
    certificates: user.certificates,
    createdTracks: user.createdTracks,
    inProgressTracks: user.inProgressTracks,
    completedTracks: user.completedTracks,
    principal: parsePrincipal(user.identity),
    identity: user.identity,
  }
}

function loadKoinBalances(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {}
  }

  const raw = window.localStorage.getItem(KOIN_STORAGE_KEY)
  if (!raw) {
    return {}
  }

  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

function saveKoinBalances(balances: Record<string, string>) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(KOIN_STORAGE_KEY, JSON.stringify(balances))
}

export function createBackendActors() {
  return {
    users_backend: {
      async getUser(identity: string) {
        try {
          const user = await request<BackendUser>(`/users/${identity}`)
          return { ok: toMotokoUser(user) }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async createUser(user: MotokoUser) {
        try {
          await request<BackendUser>('/users', {
            method: 'POST',
            body: JSON.stringify(toBackendUser(user)),
          })
          return { ok: null }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async updateUser(user: MotokoUser) {
        try {
          await request<BackendUser>(`/users/${user.identity}`, {
            method: 'PATCH',
            body: JSON.stringify(toBackendUser(user)),
          })
          return { ok: null }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async deleteUser(identity: string) {
        try {
          await request<void>(`/users/${identity}`, {
            method: 'DELETE',
          })
          return { ok: null }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async tryAccessSection(identity: string, trackId: string, sectionId: bigint) {
        try {
          const result = await request<{ allowed: boolean; reason?: string }>(
            `/users/${identity}/sections/access-check`,
            {
              method: 'POST',
              body: JSON.stringify({
                trackId,
                sectionId: Number(sectionId),
              }),
            },
          )

          if (!result.allowed) {
            return { err: result.reason ?? 'Access denied' }
          }

          return { ok: true }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
    },
    tracks_backend: {
      async listAllTracks() {
        const tracks = await request<BackendTrack[]>('/tracks')
        return tracks.map(toMotokoTrack)
      },
      async getTrackById(id: string) {
        try {
          const track = await request<BackendTrack>(`/tracks/${id}`)
          return [toMotokoTrack(track)]
        } catch {
          return []
        }
      },
      async getTracksByAuthor(authorId: string) {
        const tracks = await request<BackendTrack[]>(`/tracks/author/${authorId}`)
        return tracks.map(toMotokoTrack)
      },
      async createTrack(title: string, description: string, sections: MotokoSection[]) {
        try {
          const track = await request<BackendTrack>('/tracks', {
            method: 'POST',
            body: JSON.stringify({
              title,
              description,
              authorId: getCurrentIdentityText(),
              sections: sections.map(toBackendSection),
            }),
          })

          return { ok: track.id }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async updateTrack(id: string, track: MotokoTrack) {
        await request<BackendTrack>(`/tracks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: track.title,
            description: track.description,
            authorId: track.authorId,
            sections: track.sections.map(toBackendSection),
          }),
        })
      },
      async updateSection(sectionId: bigint, trackId: string, updatedSection: MotokoSection) {
        await request<BackendSection>(`/tracks/${trackId}/sections/${Number(sectionId)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            section: toBackendSection(updatedSection),
          }),
        })
      },
      async deleteTrack(id: string) {
        await request<void>(`/tracks/${id}`, {
          method: 'DELETE',
        })
      },
      async injectSampleTracks() {
        return null
      },
    },
    kai_backend: {
      async generateChatResponse(prompt: string, history?: string[]) {
        try {
          const response = await request<{ raw: unknown }>('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
              prompt,
              context: history?.[0],
            }),
          })
          return { ok: JSON.stringify(response.raw) }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async generateTrack(prompt: string, history?: string[]) {
        try {
          const response = await request<{ raw: unknown }>('/ai/tracks/generate', {
            method: 'POST',
            body: JSON.stringify({
              prompt,
              context: history?.[0],
            }),
          })
          return { ok: JSON.stringify(response.raw) }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
    },
    chats_backend: {
      async createChatSession(initialMessage: string) {
        try {
          const chat = await request<{ id: string }>('/chats', {
            method: 'POST',
            body: JSON.stringify({
              initialMessage,
            }),
          })
          return { ok: chat.id }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async addInteraction(chatId: string, user: string, model: string) {
        try {
          await request(`/chats/${chatId}/interactions`, {
            method: 'POST',
            body: JSON.stringify({ user, model }),
          })
          return { ok: null }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
    },
    nft_certificates: {
      async mintNFT(owner: string, trackName: string, timeSpent: string) {
        try {
          const certificate = await request<BackendCertificate>('/certificates', {
            method: 'POST',
            body: JSON.stringify({
              owner,
              trackName,
              timeSpentHours: Number(timeSpent),
            }),
          })

          return { ok: certificate.id }
        } catch (error) {
          return { err: extractErrorMessage(error) }
        }
      },
      async getNFTById(id: string) {
        try {
          const certificate = await request<BackendCertificate>(`/certificates/${id}`)
          return [
            {
              id: certificate.id,
              owner: certificate.owner,
              trackName: certificate.trackName,
              img: certificate.svg,
            },
          ]
        } catch {
          return []
        }
      },
    },
    icrc1_ledger: {
      async icrc1_balance_of({ owner }: { owner: Principal }) {
        const balances = loadKoinBalances()
        return BigInt(balances[owner.toText()] ?? DEFAULT_BALANCE.toString())
      },
      async icrc1_transfer({
        to,
        amount,
      }: {
        to: { owner: Principal }
        amount: bigint
      }) {
        const balances = loadKoinBalances()
        const owner = to.owner.toText()
        const current = BigInt(balances[owner] ?? DEFAULT_BALANCE.toString())
        balances[owner] = (current + amount).toString()
        saveKoinBalances(balances)
        return { Ok: 0n }
      },
    },
  }
}
