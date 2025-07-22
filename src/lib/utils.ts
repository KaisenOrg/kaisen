import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MotokoUser, UserData, type Section } from "@/types"
import { Principal } from "@dfinity/candid/lib/cjs/idl";

interface Positionedsection extends Section {
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
 * Gera posições para uma lista de "trilhas" (sections).
 * @param sections - O array de objetos de trilha, sem a propriedade 'position'.
 * @param options - As opções de configuração para o layout.
 * @returns Um novo array de trilhas com a propriedade 'position' adicionada.
 */
export function generateSectionPositions(
  sections: Section[],
  options: GenerationOptions
): Positionedsection[] {
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

  return sections.map((section, index) => {
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
      ...section,
      position: { top, left },
    };
  });
}

export function toMotokoUser(data: UserData): MotokoUser {
  const opt = (v?: string | null): [] | [string] => v ? [v] : [];

  return {
    picture: opt(data.picture),
    nickname: data.nickname,
    username: data.username,
    about: opt(data.about),
    role: opt(data.role),
    followers: data.followers.map(f => ({
      userIdentity: f.userIdentity,
      timestamp: BigInt(f.timestamp),
    })),
    following: data.following,
    certificates: data.certificates,
    createdTracks: data.createdTracks,
    inProgressTracks: data.inProgressTracks,
    completedTracks: data.completedTracks,
    principal: data.principal,
    identity: data.identity,
  };
}

export function toUserData(motokoUser: any): UserData {
  const fromOpt = (v: [] | [string]) => (v.length > 0 ? v[0] : null);

  return {
    picture: fromOpt(motokoUser.picture),
    nickname: motokoUser.nickname,
    username: motokoUser.username,
    about: fromOpt(motokoUser.about),
    role: fromOpt(motokoUser.role),
    followers: motokoUser.followers.map((f: any) => ({
      userIdentity: f.userIdentity,
      timestamp: Number(f.timestamp), // BigInt para number (se quiser manter bigint no front, pode)
    })),
    following: motokoUser.following,
    certificates: motokoUser.certificates,
    createdTracks: motokoUser.createdTracks,
    inProgressTracks: motokoUser.inProgressTracks,
    completedTracks: motokoUser.completedTracks,
    principal: motokoUser.principal,
    identity: motokoUser.identity,
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
