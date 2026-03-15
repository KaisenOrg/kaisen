import { Injectable } from '@nestjs/common';
import { GeminiClient } from './gemini.client';
import { KAI_SYSTEM_PROMPT, SECTION_SCHEMA_PROMPT, TRACK_SCHEMA_PROMPT } from './gemini.prompts';

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
    );

    return {
      text,
      raw: this.toGeminiTextEnvelope(text),
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
}
