import { Principal } from '@dfinity/principal'

export interface TextBlock {
  value: string
}

export interface ImageBlock {
  url: string
  caption?: string
}

export interface VideoBlock {
  url: string
  caption: string
}

export type PageElement =
  | { 'Text': TextBlock }
  | { 'Image': ImageBlock }
  | { 'Video': VideoBlock }

export interface Page {
  title: string
  elements: PageElement[]
}

export interface Flashcard {
  sentence: string
  answer: string
}

export interface Alternative {
  id: number
  text: string
}

export interface Quiz {
  question: string
  alternatives: Alternative[]
  correctAnswerId: number
}

export interface EssayQuestion {
  question: string
  expectedAnswer: string
}

export type Content =
  | { 'Page': Page }
  | { 'Flashcard': Flashcard[] }
  | { 'Quiz': Quiz[] }
  | { 'Essay': EssayQuestion[] }


export interface Section {
  id: number
  title: string
  content: Content
}

export interface Track {
  id: string
  title: string
  description: string
  authorId: string
  createdAt: number
  sections: Section[]
}

export interface UserData {
  picture?: string | null
  nickname: string
  username: string
  about?: string | null
  role?: string | null
  certificates: string[]
  createdTracks: string[]
  followers: { userIdentity: string; timestamp: number }[]
  following: string[]
  inProgressTracks: { id: string; progress: number }[]
  completedTracks: string[]
  principal: Principal
  identity: string
}

export type MotokoUser = {
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
