import { BadGatewayException, Injectable } from '@nestjs/common';
import { GeminiClient } from './gemini.client';
import { KAI_SYSTEM_PROMPT, SECTION_SCHEMA_PROMPT, TRACK_SCHEMA_PROMPT } from './gemini.prompts';

type NormalizedTrackPayload = {
  title: string;
  description: string;
  sections: Array<{
    id: number;
    title: string;
    content:
      | { type: 'Page'; title: string; content: string }
      | { type: 'Flashcard'; cards: Array<{ sentence: string; answer: string }> }
      | {
          type: 'Quiz';
          questions: Array<{
            question: string;
            alternatives: Array<{ id: number; text: string }>;
            correctAnswerId: number;
          }>;
        }
      | { type: 'Essay'; questions: Array<{ question: string; expectedAnswer: string }> };
  }>;
};

@Injectable()
export class AiService {
  constructor(private readonly geminiClient: GeminiClient) {}

  async chat(prompt: string, context?: string) {
    const text = await this.geminiClient.generateText(
      `${KAI_SYSTEM_PROMPT}\n\nPedido do usuario:\n${prompt}`,
      context,
    );

    return {
      text,
      raw: this.toGeminiTextEnvelope(text),
    };
  }

  async generateTrack(prompt: string, context?: string) {
    const text = await this.geminiClient.generateText(
      `${KAI_SYSTEM_PROMPT}\n\n${TRACK_SCHEMA_PROMPT}\n\nPedido:\n${prompt}`,
      context,
      { responseMimeType: 'application/json' },
    );

    let normalizedTrack: string;
    try {
      normalizedTrack = this.normalizeGeneratedTrack(text, prompt);
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException('Model returned invalid track structure.');
    }

    return {
      text: normalizedTrack,
      raw: this.toGeminiTextEnvelope(normalizedTrack),
    };
  }

  async generateSection(prompt: string, context?: string) {
    const text = await this.geminiClient.generateText(
      `${KAI_SYSTEM_PROMPT}\n\n${SECTION_SCHEMA_PROMPT}\n\nPedido:\n${prompt}`,
      context,
    );

    return {
      text,
      raw: this.toGeminiTextEnvelope(text),
    };
  }

  async regenerateTrackDescription(prompt: string, context?: string) {
    const text = await this.geminiClient.generateText(
      `${KAI_SYSTEM_PROMPT}\n\nGere apenas a descricao da trilha em texto.\n\nPedido:\n${prompt}`,
      context,
    );

    return {
      text,
      raw: this.toGeminiTextEnvelope(text),
    };
  }

  async generateImage(prompt: string, context?: string) {
    return this.geminiClient.generateImage(prompt, context);
  }

  private toGeminiTextEnvelope(text: string) {
    return {
      candidates: [
        {
          content: {
            parts: [{ text }],
          },
        },
      ],
    };
  }

  private normalizeGeneratedTrack(text: string, prompt: string): string {
    let parsed: unknown;
    try {
      parsed = this.parseJsonFromModelText(text);
    } catch {
      return this.buildFallbackTrackJson(prompt, text);
    }

    if (!this.isRecord(parsed)) {
      return this.buildFallbackTrackJson(prompt, text);
    }

    const sectionsRaw = Array.isArray(parsed.sections) ? parsed.sections : [];
    const sections = sectionsRaw
      .filter((section): section is Record<string, unknown> => this.isRecord(section))
      .map((section, index) => ({
        id: this.toPositiveInt(section.id, index + 1),
        title: this.ensureText(this.normalizeText(section.title), `Section ${index + 1}`),
        content: this.normalizeTrackSectionContent(section.content),
      }));

    if (sections.length === 0) {
      return this.buildFallbackTrackJson(prompt, text);
    }

    const topicFromPrompt = this.extractPromptTopic(prompt);
    const parsedTitle = this.normalizeText(parsed.title);
    const title =
      parsedTitle && !this.isUnknownTitle(parsedTitle)
        ? parsedTitle
        : this.ensureText(topicFromPrompt, 'Nova Trilha');

    const parsedDescription = this.normalizeText(parsed.description);
    const description = this.ensureText(parsedDescription, `Trilha sobre ${title}.`);

    const normalized: NormalizedTrackPayload = {
      title,
      description,
      sections,
    };

    return JSON.stringify(normalized);
  }

  private buildFallbackTrackJson(prompt: string, rawText: string): string {
    const topicFromPrompt = this.extractPromptTopic(prompt);
    const title = this.ensureText(topicFromPrompt, 'Nova Trilha');

    const cleanedText = this.cleanModelText(rawText);
    const description = this.ensureText(
      cleanedText.slice(0, 180),
      `Trilha sobre ${title}.`,
    );

    const normalized: NormalizedTrackPayload = {
      title,
      description,
      sections: [
        {
          id: 1,
          title: 'Introdução',
          content: {
            type: 'Page',
            title: 'Visão geral',
            content: this.ensureText(cleanedText, 'Conteúdo em preparação.'),
          },
        },
      ],
    };

    return JSON.stringify(normalized);
  }

  private normalizeTrackSectionContent(content: unknown) {
    if (!this.isRecord(content)) {
      return this.pageFallback();
    }

    const contentRecord = content as Record<string, unknown>;

    if (
      'Page' in contentRecord ||
      'Flashcard' in contentRecord ||
      'Quiz' in contentRecord ||
      'Essay' in contentRecord
    ) {
      return this.normalizeLegacyContent(contentRecord);
    }

    const contentType = this.normalizeText(contentRecord.type);

    if (contentType === 'Page') {
      const title = this.ensureText(this.normalizeText(contentRecord.title), 'Introdução');
      const body = this.ensureText(
        this.normalizeText(contentRecord.content) ||
          this.normalizeText(contentRecord.text) ||
          this.normalizeText(contentRecord.body),
        'Conteúdo em preparação.',
      );
      return {
        type: 'Page' as const,
        title,
        content: body,
      };
    }

    if (contentType === 'Flashcard') {
      const cardsRaw = Array.isArray(contentRecord.cards) ? contentRecord.cards : [];
      const cards = cardsRaw
        .filter((card: unknown): card is Record<string, unknown> => this.isRecord(card))
        .map((card: Record<string, unknown>) => ({
          sentence: this.normalizeText(card.sentence),
          answer: this.normalizeText(card.answer),
        }))
        .filter((card: { sentence: string; answer: string }) => card.sentence && card.answer);

      if (cards.length === 0) {
        return this.pageFallback();
      }

      return {
        type: 'Flashcard' as const,
        cards,
      };
    }

    if (contentType === 'Quiz') {
      const questionsRaw = Array.isArray(contentRecord.questions) ? contentRecord.questions : [];
      const questions = questionsRaw
        .filter((question: unknown): question is Record<string, unknown> => this.isRecord(question))
        .map((question: Record<string, unknown>) => {
          const alternativesRaw = Array.isArray(question.alternatives) ? question.alternatives : [];
          const alternatives = alternativesRaw
            .filter(
              (alternative: unknown): alternative is Record<string, unknown> =>
                this.isRecord(alternative),
            )
            .map((alternative: Record<string, unknown>, index: number) => ({
              id: this.toPositiveInt(alternative.id, index + 1),
              text: this.normalizeText(alternative.text),
            }))
            .filter((alternative: { id: number; text: string }) => alternative.text);

          const desiredCorrect = this.toPositiveInt(question.correctAnswerId, 1);
          const correctAnswerId = alternatives.some((item: { id: number }) => item.id === desiredCorrect)
            ? desiredCorrect
            : (alternatives[0]?.id ?? 1);

          return {
            question: this.normalizeText(question.question),
            alternatives,
            correctAnswerId,
          };
        })
        .filter(
          (question: { question: string; alternatives: Array<{ id: number; text: string }> }) =>
            question.question && question.alternatives.length > 0,
        );

      if (questions.length === 0) {
        return this.pageFallback();
      }

      return {
        type: 'Quiz' as const,
        questions,
      };
    }

    if (contentType === 'Essay') {
      const questionsRaw = Array.isArray(contentRecord.questions) ? contentRecord.questions : [];
      const questions = questionsRaw
        .filter((question: unknown): question is Record<string, unknown> => this.isRecord(question))
        .map((question: Record<string, unknown>) => ({
          question: this.normalizeText(question.question),
          expectedAnswer: this.normalizeText(question.expectedAnswer),
        }))
        .filter(
          (question: { question: string; expectedAnswer: string }) =>
            question.question && question.expectedAnswer,
        );

      if (questions.length === 0) {
        return this.pageFallback();
      }

      return {
        type: 'Essay' as const,
        questions,
      };
    }

    return this.pageFallback();
  }

  private normalizeLegacyContent(content: Record<string, unknown>) {
    if (this.isRecord(content.Page)) {
      const page = content.Page as Record<string, unknown>;
      return {
        type: 'Page' as const,
        title: this.ensureText(this.normalizeText(page.title), 'Introdução'),
        content: this.ensureText(this.normalizeText(page.content), 'Conteúdo em preparação.'),
      };
    }

    if (Array.isArray(content.Flashcard)) {
      const cards = content.Flashcard
        .filter((card: unknown): card is Record<string, unknown> => this.isRecord(card))
        .map((card: Record<string, unknown>) => ({
          sentence: this.normalizeText(card.sentence),
          answer: this.normalizeText(card.answer),
        }))
        .filter((card: { sentence: string; answer: string }) => card.sentence && card.answer);
      if (cards.length > 0) {
        return { type: 'Flashcard' as const, cards };
      }
    }

    if (Array.isArray(content.Quiz)) {
      const questions = content.Quiz
        .filter((question: unknown): question is Record<string, unknown> => this.isRecord(question))
        .map((question: Record<string, unknown>) => {
          const alternativesRaw = Array.isArray(question.alternatives) ? question.alternatives : [];
          const alternatives = alternativesRaw
            .filter(
              (alternative: unknown): alternative is Record<string, unknown> =>
                this.isRecord(alternative),
            )
            .map((alternative: Record<string, unknown>, index: number) => ({
              id: this.toPositiveInt(alternative.id, index + 1),
              text: this.normalizeText(alternative.text),
            }))
            .filter((alternative: { id: number; text: string }) => alternative.text);

          const desiredCorrect = this.toPositiveInt(question.correctAnswerId, 1);
          const correctAnswerId = alternatives.some((item: { id: number }) => item.id === desiredCorrect)
            ? desiredCorrect
            : (alternatives[0]?.id ?? 1);

          return {
            question: this.normalizeText(question.question),
            alternatives,
            correctAnswerId,
          };
        })
        .filter(
          (question: { question: string; alternatives: Array<{ id: number; text: string }> }) =>
            question.question && question.alternatives.length > 0,
        );

      if (questions.length > 0) {
        return { type: 'Quiz' as const, questions };
      }
    }

    if (Array.isArray(content.Essay)) {
      const questions = content.Essay
        .filter((question: unknown): question is Record<string, unknown> => this.isRecord(question))
        .map((question: Record<string, unknown>) => ({
          question: this.normalizeText(question.question),
          expectedAnswer: this.normalizeText(question.expectedAnswer),
        }))
        .filter(
          (question: { question: string; expectedAnswer: string }) =>
            question.question && question.expectedAnswer,
        );

      if (questions.length > 0) {
        return { type: 'Essay' as const, questions };
      }
    }

    return this.pageFallback();
  }

  private parseJsonFromModelText(text: string): unknown {
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const stripped = (fenceMatch?.[1] ?? text).trim();

    try {
      return JSON.parse(stripped);
    } catch {
      const start = stripped.indexOf('{');
      const end = stripped.lastIndexOf('}');

      if (start >= 0 && end > start) {
        try {
          return JSON.parse(stripped.slice(start, end + 1));
        } catch {
          throw new BadGatewayException('Model response is not valid JSON.');
        }
      }

      throw new BadGatewayException('Model response is not valid JSON.');
    }
  }

  private cleanModelText(text: string): string {
    const withoutFence = text
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();

    return withoutFence.slice(0, 6000);
  }

  private normalizeText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private ensureText(value: string, fallback: string): string {
    return value ? value : fallback;
  }

  private toPositiveInt(value: unknown, fallback: number): number {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return Math.floor(value);
    }

    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.floor(parsed);
    }

    return fallback;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isUnknownTitle(value: string): boolean {
    const normalized = value.toLowerCase();
    return normalized === 'unknown' || normalized === 'unkown' || normalized === 'desconhecido';
  }

  private extractPromptTopic(prompt: string): string {
    const normalizedPrompt = prompt
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');

    const match = normalizedPrompt.match(/sobre\s+(.+?)(?:\.|$)/i);
    if (!match?.[1]) {
      return '';
    }

    return this.normalizeText(match[1].replace(/^["'“”]|["'“”]$/g, ''));
  }

  private pageFallback() {
    return {
      type: 'Page' as const,
      title: 'Introdução',
      content: 'Conteúdo em preparação.',
    };
  }
}
