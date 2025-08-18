import { create } from "zustand";

interface CanvasState {
  position: {
    x: number;
    y: number;
  };
  setPosition: (position: { x: number; y: number }) => void;
  resetPosition: () => void; // Adicione esta linha
}

export const useCanvasStore = create<CanvasState>((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (newPosition) => set({ position: newPosition }),
  resetPosition: () => set({ position: { x: 0, y: 0 } }), // E esta linha
}));
