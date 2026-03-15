import { Body, Controller, Post } from '@nestjs/common';
import {
  GenerateChatDto,
  GenerateImageDto,
  GenerateSectionDto,
  GenerateTrackDto,
} from './dto/ai.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  chat(@Body() payload: GenerateChatDto) {
    return this.aiService.chat(payload.prompt, payload.context);
  }

  @Post('tracks/generate')
  generateTrack(@Body() payload: GenerateTrackDto) {
    return this.aiService.generateTrack(payload.prompt, payload.context);
  }

  @Post('sections/generate')
  generateSection(@Body() payload: GenerateSectionDto) {
    return this.aiService.generateSection(payload.prompt, payload.context);
  }

  @Post('tracks/description/regenerate')
  regenerateTrackDescription(@Body() payload: GenerateTrackDto) {
    return this.aiService.regenerateTrackDescription(payload.prompt, payload.context);
  }

  @Post('images/generate')
  generateImage(@Body() payload: GenerateImageDto) {
    return this.aiService.generateImage(payload.prompt, payload.context);
  }
}
