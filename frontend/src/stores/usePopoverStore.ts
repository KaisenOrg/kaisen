import { create } from 'zustand';
import { type Section } from '@/types';
import type { ReactNode } from 'react';

type PopoverPayload =
  | { type: 'section'; data: Section, useAlertDialog?: boolean }
  | {
    type: 'generic';
    title: string;
    description?: string;
    content: ReactNode;
    onConfirm?: () => void;
    useAlertDialog?: boolean;
  }
  | { type: 'loading', progress?: number };

interface PopoverState {
  isOpen: boolean;
  payload: PopoverPayload | null;
  open: (payload: PopoverPayload) => void;
  close: () => void;
}

export const usePopoverStore = create<PopoverState>((set) => ({
  isOpen: false,
  payload: null,
  open: (payload) => set({ payload, isOpen: true }),
  close: () => set({ isOpen: false, payload: null }),
}));