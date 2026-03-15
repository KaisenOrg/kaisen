import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddInteractionDto, CreateChatDto } from './dto/chat.dto';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() payload: CreateChatDto) {
    return this.chatsService.create(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Post(':id/interactions')
  addInteraction(@Param('id') id: string, @Body() payload: AddInteractionDto) {
    return this.chatsService.addInteraction(id, payload);
  }
}
