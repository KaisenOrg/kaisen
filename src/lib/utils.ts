import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MotokoUser, UserData } from "@/types"
import {
  Track as BackendTrack,
  Section as BackendSection,
  Content as BackendContent,
  Page as BackendPage,
  PageElement as BackendElement,
  Flashcard as BackendFlashcard,
  Quiz as BackendQuiz,
  EssayQuestion as BackendEssay,
  Alternative as BackendAlternative
} from "@/declarations/tracks_backend/tracks_backend.did";

import { Track, Section, Content, Page, PageElement, Flashcard, Quiz, EssayQuestion } from "@/types";

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

const opt = (v?: string | null): [] | [string] => v ? [v] : [];

const fromOpt = (v: [] | [string]) => (v.length > 0 ? v[0] : null);

export function toMotokoTrack(track: Track): BackendTrack {
  return {
    id: track.id,
    title: track.title,
    description: track.description,
    authorId: track.authorId,
    createdAt: BigInt(track.createdAt),
    sections: track.sections.map(toMotokoSection),
  };
}

export function toMotokoSection(section: Section): BackendSection {
  return {
    id: BigInt(section.id),
    title: section.title,
    content: toMotokoContent(section.content),
  };
}

function toMotokoContent(content: Content): BackendContent {
  if ("Page" in content) {
    return {
      Page: {
        title: content.Page.title,
        elements: content.Page.elements.map(toMotokoElement),
      },
    };
  }

  if ("Flashcard" in content) {
    return {
      Flashcard: content.Flashcard.map((f): BackendFlashcard => ({
        sentence: f.sentence,
        answer: f.answer,
      })),
    };
  }

  if ("Quiz" in content) {
    return {
      Quiz: content.Quiz.map((q): BackendQuiz => ({
        question: q.question,
        alternatives: q.alternatives.map((a): BackendAlternative => ({
          id: BigInt(a.id),
          text: a.text,
        })),
        correctAnswerId: BigInt(q.correctAnswerId),
      })),
    };
  }

  if ("Essay" in content) {
    return {
      Essay: content.Essay.map((e): BackendEssay => ({
        question: e.question,
        expectedAnswer: e.expectedAnswer,
      })),
    };
  }

  throw new Error("Conteúdo inválido");
}

function toMotokoElement(element: PageElement): BackendElement {
  if ("Text" in element) {
    return {
      Text: {
        value: element.Text.value,
      },
    };
  }

  if ("Image" in element) {
    return {
      Image: {
        url: element.Image.url,
        caption: element.Image.caption ? [element.Image.caption] : [],
      },
    };
  }

  if ("Video" in element) {
    return {
      Video: {
        url: element.Video.url,
        caption: element.Video.caption,
      },
    };
  }

  throw new Error("Elemento inválido");
}

function toFrontendElement(element: BackendElement): PageElement {
  if ("Text" in element) {
    return {
      Text: {
        value: element.Text.value,
      },
    };
  }

  if ("Image" in element) {
    return {
      Image: {
        url: element.Image.url,
        caption: fromOpt(element.Image.caption) || undefined,
      },
    };
  }

  if ("Video" in element) {
    return {
      Video: {
        url: element.Video.url,
        caption: element.Video.caption,
      },
    };
  }

  throw new Error("Elemento inválido");
}

function toFrontendContent(content: BackendContent): Content {
  if ("Page" in content) {
    return {
      Page: {
        title: content.Page.title,
        elements: content.Page.elements.map(toFrontendElement),
      },
    };
  }

  if ("Flashcard" in content) {
    return {
      Flashcard: content.Flashcard.map((f): Flashcard => ({
        sentence: f.sentence,
        answer: f.answer,
      })),
    };
  }

  if ("Quiz" in content) {
    return {
      Quiz: content.Quiz.map((q): Quiz => ({
        question: q.question,
        alternatives: q.alternatives.map((a) => ({
          id: Number(a.id),
          text: a.text,
        })),
        correctAnswerId: Number(q.correctAnswerId),
      })),
    };
  }

  if ("Essay" in content) {
    return {
      Essay: content.Essay.map((e): EssayQuestion => ({
        question: e.question,
        expectedAnswer: e.expectedAnswer,
      })),
    };
  }

  throw new Error("Conteúdo inválido");
}

export function toFrontendSection(section: BackendSection): Section {
  return {
    id: Number(section.id),
    title: section.title,
    content: toFrontendContent(section.content),
  };
}

export function toFrontendTrack(track: BackendTrack): Track {
  return {
    id: track.id,
    title: track.title,
    description: track.description,
    authorId: track.authorId,
    createdAt: Number(track.createdAt),
    sections: track.sections.map(toFrontendSection),
  };
}

export function toMotokoUser(data: UserData): MotokoUser {
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
