import { create } from 'zustand'
import { type Section } from '@/types'

type ModalPayload =
  | { type: 'section'; data: Section, useAlertDialog?: boolean }
  | { type: 'create-track'; navigate: (route: string) => void, useAlertDialog?: boolean }
  | {
    type: 'generic'
    title: string
    content: React.ReactNode
    description?: string
    onConfirm?: () => void
    useAlertDialog?: boolean
  }
  | { type: 'loading', progress?: number, useAlertDialog?: boolean }

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