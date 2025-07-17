import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface Track { // mover para outro lugar como uma Types sei la
  id: number | string;
  // ...outras propriedades do track
  [key: string]: any;
}

interface PositionedTrack extends Track {
  position: {
    top: number;
    left: number;
  };
}

interface GenerationOptions {
  cardWidth: number;
  canvasHeight: number;
  gap?: number;
  initialLeftOffset?: number;
  initialTopOffset?: number;
  verticalBounds?: [number, number];
  maxVerticalShift?: number;
}

/**
 * Gera posições para uma lista de "trilhas" (tracks).
 * @param tracks - O array de objetos de trilha, sem a propriedade 'position'.
 * @param options - As opções de configuração para o layout.
 * @returns Um novo array de trilhas com a propriedade 'position' adicionada.
 */
export function generateTrackPositions(
  tracks: Track[],
  options: GenerationOptions
): PositionedTrack[] {
  const {
    cardWidth,
    canvasHeight,
    gap = 100,
    initialLeftOffset = 200,
    initialTopOffset = 0,
    verticalBounds = [0.3, 0.7],
    maxVerticalShift = 100,
  } = options;

  // Calcula os limites verticais em pixels
  const minY = canvasHeight * verticalBounds[0] + initialTopOffset;
  const maxY = canvasHeight * verticalBounds[1] + initialTopOffset;

  let lastTop: number | null = null;

  return tracks.map((track, index) => {
    // --- Cálculo da Posição Horizontal (left) ---
    const left = initialLeftOffset + index * (cardWidth + gap);

    // --- Cálculo da Posição Vertical (top) ---
    let top: number;

    if (lastTop === null) {
      // Para o primeiro card, escolhe uma posição aleatória dentro da faixa central
      top = minY + Math.random() * (maxY - minY);
    } else {
      // Para os cards seguintes, calcula um desvio aleatório em relação ao anterior
      const shift = (Math.random() - 0.5) * 2 * maxVerticalShift; // Valor entre -maxVerticalShift e +maxVerticalShift
      const proposedTop = lastTop + shift;

      // Garante que a nova posição não saia dos limites verticais definidos
      top = Math.max(minY, Math.min(proposedTop, maxY));
    }

    lastTop = top;

    return {
      ...track,
      position: { top, left },
    };
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
