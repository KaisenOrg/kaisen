import { create } from 'zustand'
import { type Section } from '@/types'

type PopoverPayload =
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

interface PopoverState {
  isOpen: boolean
  payload: PopoverPayload | null
  open: (payload: PopoverPayload) => void
  close: () => void
}

export const usePopoverStore = create<PopoverState>((set) => ({
  isOpen: false,
  payload: null,
  open: (payload) => set({ payload, isOpen: true }),
  close: () => set({ isOpen: false, payload: null }),
}))