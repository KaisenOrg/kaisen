import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
}

@Injectable()
export class GeminiClient {
  private readonly apiKey?: string;
  private readonly textModel: string;
  private readonly imageModel: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.textModel = this.configService.get<string>('GEMINI_TEXT_MODEL', 'gemini-2.5-flash');
    this.imageModel = this.configService.get<string>(
      'GEMINI_IMAGE_MODEL',
      'gemini-2.0-flash-preview-image-generation',
    );
  }

  async generateText(prompt: string, context?: string): Promise<string> {
    const response = await this.request(this.textModel, {
      contents: this.buildContents(prompt, context),
    });

    const text = response.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
    if (!text) {
      throw new BadGatewayException('Gemini returned no text content.');
    }

    return text;
  }

  async generateImage(prompt: string, context?: string) {
    const response = await this.request(this.imageModel, {
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
      contents: this.buildContents(prompt, context),
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const image = parts.find((part) => part.inlineData)?.inlineData;
    const text = parts.find((part) => part.text)?.text ?? null;

    if (!image) {
      throw new BadGatewayException('Gemini returned no image content.');
    }

    return {
      mimeType: image.mimeType,
      data: image.data,
      text,
    };
  }

  private buildContents(prompt: string, context?: string) {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (context?.trim()) {
      contents.push({
        role: 'user',
        parts: [{ text: `Contexto anterior:\n${context}` }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    return contents;
  }

  private async request(model: string, body: Record<string, unknown>): Promise<GeminiResponse> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException('GEMINI_API_KEY is not configured.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new BadGatewayException(await response.text());
    }

    return (await response.json()) as GeminiResponse;
  }
}
