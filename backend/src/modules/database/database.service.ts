import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { DatabaseState, TrackRecord, UserRecord } from './database.types';

const DEFAULT_AUTHOR_ID = 'local-dev-user';

function createSampleTracks(authorId: string): TrackRecord[] {
  return [
    {
      id: 'track-frontend-fundamentals',
      title: 'Frontend Fundamentals',
      description: 'HTML, CSS and React basics organized in a practical learning path.',
      authorId,
      createdAt: new Date(Date.now() - 86_400_000).toISOString(),
      sections: [
        {
          id: 1,
          title: 'HTML and semantic structure',
          content: {
            type: 'Page',
            title: 'Semantic HTML',
            content:
              'Learn when to use header, main, section and article to improve accessibility and structure.',
          },
        },
        {
          id: 2,
          title: 'CSS layout with Flexbox',
          content: {
            type: 'Flashcard',
            cards: [
              {
                sentence: 'What does display: flex do?',
                answer: 'Turns an element into a flex container.',
              },
              {
                sentence: 'Which axis does justify-content control?',
                answer: 'The main axis.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'track-typescript-practice',
      title: 'TypeScript in Practice',
      description: 'Use static typing to refactor safer and ship faster.',
      authorId,
      createdAt: new Date(Date.now() - 43_200_000).toISOString(),
      sections: [
        {
          id: 1,
          title: 'Primitive and union types',
          content: {
            type: 'Page',
            title: 'Types that model reality',
            content:
              'Primitive, literal and union types help constrain values and reduce invalid states.',
          },
        },
      ],
    },
  ];
}

function createSeedUser(identity: string): UserRecord {
  return {
    identity,
    picture: null,
    nickname: 'Dev User',
    username: `dev-${identity.slice(0, 5)}`,
    about: 'Generated locally for development.',
    role: 'Learner',
    followers: [],
    following: [],
    certificates: [],
    createdTracks: createSampleTracks(identity).map((track) => track.id),
    inProgressTracks: [],
    completedTracks: [],
  };
}

function createDefaultState(): DatabaseState {
  return {
    users: [createSeedUser(DEFAULT_AUTHOR_ID)],
    tracks: createSampleTracks(DEFAULT_AUTHOR_ID),
    chats: [],
    certificates: [],
  };
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private state: DatabaseState = createDefaultState();
  private readonly filePath: string;
  private writeQueue: Promise<void> = Promise.resolve();
  private loaded = false;

  constructor(private readonly configService: ConfigService) {
    this.filePath = resolve(this.configService.get<string>('DATA_FILE_PATH', './data/db.json'));
  }

  async onModuleInit(): Promise<void> {
    await this.ensureLoaded();
  }

  async read<T>(selector: (state: DatabaseState) => T): Promise<T> {
    await this.ensureLoaded();
    return selector(this.state);
  }

  async write<T>(updater: (state: DatabaseState) => T | Promise<T>): Promise<T> {
    await this.ensureLoaded();
    const result = await updater(this.state);
    this.writeQueue = this.writeQueue.then(async () => {
      await this.persist();
    });
    await this.writeQueue;
    return result;
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) {
      return;
    }

    await mkdir(dirname(this.filePath), { recursive: true });

    try {
      const raw = await readFile(this.filePath, 'utf8');
      this.state = JSON.parse(raw) as DatabaseState;
    } catch {
      this.state = createDefaultState();
      await this.persist();
    }

    this.loaded = true;
  }

  private async persist(): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(this.state, null, 2), 'utf8');
  }
}
