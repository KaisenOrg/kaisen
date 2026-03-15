import { Principal } from '@dfinity/principal'
import type { MotokoUser } from '@/types'

type BackendPage = {
  title: string
  content: string
}

type BackendFlashcard = {
  sentence: string
  answer: string
}

type BackendAlternative = {
  id: bigint
  text: string
}

type BackendQuiz = {
  question: string
  alternatives: BackendAlternative[]
  correctAnswerId: bigint
}

type BackendEssay = {
  question: string
  expectedAnswer: string
}

type BackendContent =
  | { Page: BackendPage }
  | { Flashcard: BackendFlashcard[] }
  | { Quiz: BackendQuiz[] }
  | { Essay: BackendEssay[] }

type BackendSection = {
  id: bigint
  title: string
  content: BackendContent
}

type BackendTrack = {
  id: string
  title: string
  description: string
  authorId: string
  createdAt: bigint
  sections: BackendSection[]
}

type NFT = {
  id: string
  img: string
  owner: string
  trackName: string
}

type MockDb = {
  users: Record<string, MotokoUser>
  tracks: BackendTrack[]
  chats: Record<string, { id: string; interactions: { user: string; model: string }[] }>
  balances: Record<string, string>
  nfts: Record<string, NFT>
}

const STORAGE_KEY = 'kaisen.mock.db.v1'
const DEFAULT_BALANCE = 1_250_00000000n

const defaultPrincipalText = '2vxsx-fae'

function createSampleTracks(authorId: string): BackendTrack[] {
  return [
    {
      id: 'track-frontend-fundamentals',
      title: 'Frontend Fundamentals',
      description: 'HTML, CSS and React basics organized in a practical learning path.',
      authorId,
      createdAt: BigInt(Date.now() - 86_400_000),
      sections: [
        {
          id: 1n,
          title: 'HTML and semantic structure',
          content: {
            Page: {
              title: 'Semantic HTML',
              content:
                'Learn when to use header, main, section and article to improve accessibility and structure.',
            },
          },
        },
        {
          id: 2n,
          title: 'CSS layout with Flexbox',
          content: {
            Flashcard: [
              { sentence: 'What does `display: flex` do?', answer: 'Turns an element into a flex container.' },
              { sentence: 'Which axis does `justify-content` control?', answer: 'The main axis.' },
            ],
          },
        },
        {
          id: 3n,
          title: 'React component model',
          content: {
            Quiz: [
              {
                question: 'What is a React component?',
                alternatives: [
                  { id: 1n, text: 'A reusable UI function' },
                  { id: 2n, text: 'A CSS utility' },
                  { id: 3n, text: 'A database table' },
                ],
                correctAnswerId: 1n,
              },
            ],
          },
        },
      ],
    },
    {
      id: 'track-typescript-practice',
      title: 'TypeScript in Practice',
      description: 'Use static typing to refactor safer and ship faster.',
      authorId,
      createdAt: BigInt(Date.now() - 43_200_000),
      sections: [
        {
          id: 1n,
          title: 'Primitive and union types',
          content: {
            Page: {
              title: 'Types that model reality',
              content:
                'Primitive, literal and union types help constrain values and reduce invalid states.',
            },
          },
        },
        {
          id: 2n,
          title: 'Type narrowing',
          content: {
            Essay: [
              {
                question: 'Explain why type narrowing matters in conditional branches.',
                expectedAnswer:
                  'Type narrowing lets TypeScript infer more specific types after runtime checks, preventing invalid property access.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'track-web3-onboarding',
      title: 'Web3 Onboarding',
      description: 'A gentle introduction to wallets, principals and blockchain app flow.',
      authorId,
      createdAt: BigInt(Date.now() - 21_600_000),
      sections: [
        {
          id: 1n,
          title: 'What is a wallet?',
          content: {
            Page: {
              title: 'Wallet basics',
              content:
                'A wallet manages keys and signs actions. It is not the blockchain itself.',
            },
          },
        },
        {
          id: 2n,
          title: 'Principals and identity',
          content: {
            Quiz: [
              {
                question: 'What identifies a user on ICP?',
                alternatives: [
                  { id: 1n, text: 'A principal' },
                  { id: 2n, text: 'An email address' },
                  { id: 3n, text: 'A CSS class' },
                ],
                correctAnswerId: 1n,
              },
            ],
          },
        },
      ],
    },
  ]
}

function createDefaultDb(): MockDb {
  const authorId = defaultPrincipalText
  return {
    users: {},
    tracks: createSampleTracks(authorId),
    chats: {},
    balances: {
      [authorId]: DEFAULT_BALANCE.toString(),
    },
    nfts: {},
  }
}

function serializeDb(db: MockDb) {
  return JSON.stringify(db, (_key, value) => {
    if (typeof value === 'bigint') {
      return { __bigint: value.toString() }
    }

    if (value instanceof Principal) {
      return { __principal: value.toText() }
    }

    return value
  })
}

function deserializeDb(raw: string): MockDb {
  return JSON.parse(raw, (_key, value) => {
    if (value && typeof value === 'object') {
      if ('__bigint' in value) {
        return BigInt(value.__bigint)
      }

      if ('__principal' in value) {
        return Principal.fromText(value.__principal)
      }
    }

    return value
  }) as MockDb
}

function loadDb(): MockDb {
  if (typeof window === 'undefined') return createDefaultDb()

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return createDefaultDb()

  try {
    return deserializeDb(stored)
  } catch {
    return createDefaultDb()
  }
}

function saveDb(db: MockDb) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, serializeDb(db))
}

function withDb<T>(updater: (db: MockDb) => T): T {
  const db = loadDb()
  const result = updater(db)
  saveDb(db)
  return result
}

function ensureUser(identity: string): MotokoUser {
  return withDb((db) => {
    if (!db.users[identity]) {
      const principal = Principal.fromText(identity)
      db.users[identity] = {
        picture: [],
        nickname: 'Dev User',
        username: `dev-${identity.slice(0, 5)}`,
        about: ['Mock user generated locally for frontend development.'],
        role: ['Learner'],
        followers: [],
        following: [],
        certificates: [],
        createdTracks: db.tracks.filter((track) => track.authorId === identity).map((track) => track.id),
        inProgressTracks: [],
        completedTracks: [],
        principal,
        identity,
      }
    }

    if (!db.balances[identity]) {
      db.balances[identity] = DEFAULT_BALANCE.toString()
    }

    return db.users[identity]
  })
}

function getTextFromPrompt(prompt: string) {
  const normalized = prompt.toLowerCase()

  if (normalized.includes('corrigindo uma prova de dissertativa')) {
    const expected = prompt.match(/Resposta esperada:\s*([\s\S]*?)\n\nResposta do aluno:/)?.[1]?.trim() ?? ''
    const answer = prompt.match(/Resposta do aluno:\s*([\s\S]*?)\n\nDiga se a resposta/i)?.[1]?.trim() ?? ''
    const isCorrect =
      answer.length > 20 &&
      expected
        .toLowerCase()
        .split(/\W+/)
        .filter(Boolean)
        .some((token) => answer.toLowerCase().includes(token))

    return isCorrect
      ? 'Correto. Sua resposta cobre a ideia principal e demonstra entendimento suficiente.'
      : 'Incorreto. Faltou mencionar a ideia central esperada na resposta.'
  }

  if (normalized.includes('quiz')) {
    return 'Vamos fazer assim: me diga o tema e eu monto 5 perguntas objetivas para voce.'
  }

  if (normalized.includes('explain') || normalized.includes('explique')) {
    return 'Claro. Diga qual conceito voce quer estudar e eu explico em passos simples, com exemplos.'
  }

  return `Mock do Kai: recebi sua mensagem "${prompt.slice(0, 120)}". O backend Motoko foi substituido por uma resposta local para destravar o frontend.`
}

function buildGeminiResponse(text: string) {
  return JSON.stringify({
    candidates: [
      {
        content: {
          parts: [{ text }],
        },
      },
    ],
  })
}

function buildGeneratedTrack(prompt: string) {
  const topic = prompt.match(/trilha sobre (.+?)\./i)?.[1]?.trim() || 'Novo tema'
  const payload = {
    title: topic,
    description: `Trilha mockada sobre ${topic} para navegar no frontend sem o backend em Motoko.`,
    sections: [
      {
        id: 1,
        title: `Introducao a ${topic}`,
        content: {
          Page: {
            title: `Primeiros passos em ${topic}`,
            content: `Esta e uma secao mockada para o tema ${topic}.`,
          },
        },
      },
      {
        id: 2,
        title: `Praticando ${topic}`,
        content: {
          Quiz: [
            {
              question: `Qual e o objetivo principal de estudar ${topic}?`,
              alternatives: [
                { id: 1, text: 'Entender os fundamentos' },
                { id: 2, text: 'Ignorar a pratica' },
                { id: 3, text: 'Memorizar sem contexto' },
              ],
              correctAnswerId: 1,
            },
          ],
        },
      },
    ],
  }

  return JSON.stringify(payload)
}

export function getMockActor(canisterName: string) {
  switch (canisterName) {
    case 'users_backend':
      return {
        async getUser(identity: string) {
          return { ok: ensureUser(identity) }
        },
        async createUser(user: MotokoUser) {
          return withDb((db) => {
            db.users[user.identity] = user
            return { ok: null }
          })
        },
        async updateUser(user: MotokoUser) {
          return withDb((db) => {
            db.users[user.identity] = user
            return { ok: null }
          })
        },
        async deleteUser(identity: string) {
          return withDb((db) => {
            delete db.users[identity]
            return { ok: null }
          })
        },
        async tryAccessSection(identity: string, trackId: string, sectionId: bigint) {
          const user = ensureUser(identity)
          const progress = user.inProgressTracks.find((track) => track.id === trackId)?.progress ?? 0
          if (Number(sectionId) > progress + 1) {
            return { err: 'Complete a secao anterior primeiro.' }
          }
          return { ok: true }
        },
      }

    case 'tracks_backend':
      return {
        async listAllTracks() {
          return withDb((db) => db.tracks)
        },
        async getTrackById(id: string) {
          return withDb((db) => db.tracks.filter((track) => track.id === id))
        },
        async getTracksByAuthor(authorId: string) {
          return withDb((db) => db.tracks.filter((track) => track.authorId === authorId))
        },
        async createTrack(title: string, description: string, sections: BackendSection[]) {
          return withDb((db) => {
            const id = `track-${crypto.randomUUID().slice(0, 8)}`
            db.tracks.unshift({
              id,
              title,
              description,
              authorId: defaultPrincipalText,
              createdAt: BigInt(Date.now()),
              sections,
            })
            return { ok: id }
          })
        },
        async updateTrack(id: string, track: BackendTrack) {
          return withDb((db) => {
            db.tracks = db.tracks.map((item) => (item.id === id ? track : item))
          })
        },
        async updateSection(sectionId: bigint, trackId: string, updatedSection: BackendSection) {
          return withDb((db) => {
            db.tracks = db.tracks.map((track) =>
              track.id !== trackId
                ? track
                : {
                    ...track,
                    sections: track.sections.map((section) =>
                      section.id === sectionId ? updatedSection : section
                    ),
                  }
            )
          })
        },
        async deleteTrack(id: string) {
          return withDb((db) => {
            db.tracks = db.tracks.filter((track) => track.id !== id)
          })
        },
        async injectSampleTracks() {
          return withDb((db) => {
            if (db.tracks.length === 0) {
              db.tracks = createSampleTracks(defaultPrincipalText)
            }
          })
        },
      }

    case 'kai_backend':
      return {
        async generateChatResponse(prompt: string) {
          return {
            ok: buildGeminiResponse(getTextFromPrompt(prompt)),
          }
        },
        async generateTrack(prompt: string) {
          return {
            ok: buildGeminiResponse(buildGeneratedTrack(prompt)),
          }
        },
      }

    case 'chats_backend':
      return {
        async createChatSession(initialMessage: string) {
          return withDb((db) => {
            const id = `chat-${crypto.randomUUID().slice(0, 8)}`
            db.chats[id] = {
              id,
              interactions: [{ user: initialMessage, model: '' }],
            }
            return { ok: id }
          })
        },
        async addInteraction(chatId: string, user: string, model: string) {
          return withDb((db) => {
            if (!db.chats[chatId]) {
              db.chats[chatId] = { id: chatId, interactions: [] }
            }
            db.chats[chatId].interactions.push({ user, model })
            return { ok: null }
          })
        },
      }

    case 'icrc1_ledger':
      return {
        async icrc1_balance_of({ owner }: { owner: Principal }) {
          return withDb((db) => BigInt(db.balances[owner.toText()] ?? DEFAULT_BALANCE.toString()))
        },
        async icrc1_transfer({
          to,
          amount,
        }: {
          to: { owner: Principal }
          amount: bigint
        }) {
          return withDb((db) => {
            const receiver = to.owner.toText()
            const current = BigInt(db.balances[receiver] ?? '0')
            db.balances[receiver] = (current + amount).toString()
            return { Ok: 0n }
          })
        },
      }

    case 'nft_certificates':
      return {
        async mintNFT(username: string, trackName: string, timeSpent: string) {
          return withDb((db) => {
            const id = `nft-${crypto.randomUUID().slice(0, 8)}`
            db.nfts[id] = {
              id,
              owner: username,
              trackName,
              img: `
                <svg xmlns="http://www.w3.org/2000/svg" width="720" height="520" viewBox="0 0 720 520">
                  <rect width="720" height="520" rx="28" fill="#101828"/>
                  <rect x="18" y="18" width="684" height="484" rx="20" fill="#182230" stroke="#f59e0b" stroke-width="3"/>
                  <text x="360" y="120" text-anchor="middle" fill="#f8fafc" font-size="36" font-family="Arial">Kaisen Certificate</text>
                  <text x="360" y="200" text-anchor="middle" fill="#f59e0b" font-size="28" font-family="Arial">${username}</text>
                  <text x="360" y="250" text-anchor="middle" fill="#cbd5e1" font-size="22" font-family="Arial">completed ${trackName}</text>
                  <text x="360" y="310" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="Arial">Time spent: ${timeSpent} hours</text>
                  <text x="360" y="400" text-anchor="middle" fill="#64748b" font-size="16" font-family="Arial">Mock NFT generated locally</text>
                </svg>
              `,
            }
            return { ok: id }
          })
        },
        async getNFTById(id: string) {
          return withDb((db) => (db.nfts[id] ? [db.nfts[id]] : []))
        },
      }

    default:
      return null
  }
}
