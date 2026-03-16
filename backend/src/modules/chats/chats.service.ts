import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { ChatRecord } from '../database/database.types';
import { AddInteractionDto, CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(payload: CreateChatDto): Promise<ChatRecord> {
    return this.databaseService.write((state) => {
      const now = new Date().toISOString();
      const chat: ChatRecord = {
        id: `chat-${randomUUID().slice(0, 8)}`,
        createdAt: now,
        interactions: [
          {
            user: payload.initialMessage,
            model: '',
            createdAt: now,
          },
        ],
      };

      state.chats.unshift(chat);
      return chat;
    });
  }

  async findOne(id: string): Promise<ChatRecord> {
    const chat = await this.databaseService.read((state) =>
      state.chats.find((item) => item.id === id),
    );

    if (!chat) {
      throw new NotFoundException(`Chat ${id} was not found.`);
    }

    return chat;
  }

  async addInteraction(id: string, payload: AddInteractionDto): Promise<ChatRecord> {
    return this.databaseService.write((state) => {
      const chat = state.chats.find((item) => item.id === id);
      if (!chat) {
        throw new NotFoundException(`Chat ${id} was not found.`);
      }

      chat.interactions.push({
        ...payload,
        createdAt: new Date().toISOString(),
      });

      return chat;
    });
  }
}
