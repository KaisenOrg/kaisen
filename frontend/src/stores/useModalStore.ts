import { create } from 'zustand'
import { type Content, type Section } from '@/types'

type ModalPayload =
  | {
    type: 'generic'
    title: string
    content: React.ReactNode
    description?: string
    onConfirm?: () => void
    useAlertDialog?: boolean
  }
  | { type: 'section'; data: Section, useAlertDialog?: boolean }
  | { type: 'create-track'; navigate: (route: string) => void, useAlertDialog?: boolean }
  | { type: 'loading', progress?: number, useAlertDialog?: boolean }
  | { type: 'choose-section-content'; useAlertDialog?: boolean }
  | { type: 'create-summary', content?: Content, useAlertDialog?: boolean }

interface ModalState {
  isOpen: boolean
  payload: ModalPayload | null
  open: (payload: ModalPayload) => void
  close: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  payload: null,
  open: (payload) => set({ payload, isOpen: true }),
  close: () => set({ isOpen: false, payload: null }),
}))