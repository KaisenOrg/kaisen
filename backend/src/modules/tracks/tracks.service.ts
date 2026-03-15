import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  EssayContent,
  FlashcardContent,
  PageContent,
  QuizContent,
  TrackRecord,
  TrackSectionRecord,
} from '../database/database.types';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<TrackRecord[]> {
    return this.databaseService.read((state) =>
      [...state.tracks].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    );
  }

  async findOne(id: string): Promise<TrackRecord> {
    const track = await this.databaseService.read((state) =>
      state.tracks.find((item) => item.id === id),
    );

    if (!track) {
      throw new NotFoundException(`Track ${id} was not found.`);
    }

    return track;
  }

  async findByAuthor(authorId: string): Promise<TrackRecord[]> {
    return this.databaseService.read((state) =>
      state.tracks.filter((track) => track.authorId === authorId),
    );
  }

  async create(payload: CreateTrackDto): Promise<TrackRecord> {
    return this.databaseService.write((state) => {
      const track: TrackRecord = {
        title: payload.title,
        description: payload.description,
        authorId: payload.authorId,
        sections: payload.sections.map((section) => this.normalizeSection(section)),
        id: `track-${randomUUID().slice(0, 8)}`,
        createdAt: new Date().toISOString(),
      };

      state.tracks.unshift(track);

      const author = state.users.find((user) => user.identity === payload.authorId);
      if (author && !author.createdTracks.includes(track.id)) {
        author.createdTracks.unshift(track.id);
      }

      return track;
    });
  }

  async update(id: string, payload: UpdateTrackDto): Promise<TrackRecord> {
    return this.databaseService.write((state) => {
      const index = state.tracks.findIndex((track) => track.id === id);
      if (index < 0) {
        throw new NotFoundException(`Track ${id} was not found.`);
      }

      state.tracks[index] = {
        ...state.tracks[index],
        title: payload.title,
        description: payload.description,
        authorId: payload.authorId,
        sections: payload.sections.map((section) => this.normalizeSection(section)),
        id,
      };

      return state.tracks[index];
    });
  }

  async updateSection(
    id: string,
    sectionId: number,
    section: CreateTrackDto['sections'][number],
  ) {
    return this.databaseService.write((state) => {
      const track = state.tracks.find((item) => item.id === id);
      if (!track) {
        throw new NotFoundException(`Track ${id} was not found.`);
      }

      const sectionIndex = track.sections.findIndex((item) => item.id === sectionId);
      if (sectionIndex < 0) {
        throw new NotFoundException(`Section ${sectionId} was not found in track ${id}.`);
      }

      track.sections[sectionIndex] = this.normalizeSection(section);
      return track.sections[sectionIndex];
    });
  }

  async remove(id: string): Promise<void> {
    await this.databaseService.write((state) => {
      const nextTracks = state.tracks.filter((track) => track.id !== id);
      if (nextTracks.length === state.tracks.length) {
        throw new NotFoundException(`Track ${id} was not found.`);
      }

      state.tracks = nextTracks;
      state.users.forEach((user) => {
        user.createdTracks = user.createdTracks.filter((trackId) => trackId !== id);
        user.completedTracks = user.completedTracks.filter((trackId) => trackId !== id);
        user.inProgressTracks = user.inProgressTracks.filter((track) => track.id !== id);
      });
    });
  }

  normalizeSection(section: CreateTrackDto['sections'][number]): TrackSectionRecord {
    return {
      id: section.id,
      title: section.title,
      content: this.normalizeSectionContent(section.content),
    };
  }

  private normalizeSectionContent(
    content: CreateTrackDto['sections'][number]['content'],
  ): PageContent | FlashcardContent | QuizContent | EssayContent {
    switch (content.type) {
      case 'Page':
        return {
          type: 'Page',
          title: content.title ?? '',
          content: content.content ?? '',
        };
      case 'Flashcard':
        return {
          type: 'Flashcard',
          cards: content.cards ?? [],
        };
      case 'Quiz':
        return {
          type: 'Quiz',
          questions: (content.questions ?? []) as QuizContent['questions'],
        };
      case 'Essay':
        return {
          type: 'Essay',
          questions: (content.questions ?? []) as EssayContent['questions'],
        };
    }
  }
}
