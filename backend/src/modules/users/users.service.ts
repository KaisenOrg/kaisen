import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserRecord } from '../database/database.types';
import { CheckSectionAccessDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(identity: string): Promise<UserRecord> {
    const user = await this.databaseService.read((state) =>
      state.users.find((item) => item.identity === identity),
    );

    if (!user) {
      throw new NotFoundException(`User ${identity} was not found.`);
    }

    return user;
  }

  async create(payload: CreateUserDto): Promise<UserRecord> {
    return this.databaseService.write((state) => {
      state.users = state.users.filter((user) => user.identity !== payload.identity);
      const createdUser: UserRecord = {
        ...payload,
        picture: payload.picture ?? null,
        about: payload.about ?? null,
        role: payload.role ?? null,
      };
      state.users.push(createdUser);
      return createdUser;
    });
  }

  async update(identity: string, payload: UpdateUserDto): Promise<UserRecord> {
    return this.databaseService.write((state) => {
      const index = state.users.findIndex((user) => user.identity === identity);

      if (index < 0) {
        throw new NotFoundException(`User ${identity} was not found.`);
      }

      state.users[index] = {
        ...payload,
        identity,
        picture: payload.picture ?? null,
        about: payload.about ?? null,
        role: payload.role ?? null,
      };

      return state.users[index];
    });
  }

  async remove(identity: string): Promise<void> {
    await this.databaseService.write((state) => {
      const nextUsers = state.users.filter((user) => user.identity !== identity);

      if (nextUsers.length === state.users.length) {
        throw new NotFoundException(`User ${identity} was not found.`);
      }

      state.users = nextUsers;
    });
  }

  async canAccessNextSection(
    identity: string,
    payload: CheckSectionAccessDto,
  ): Promise<{ allowed: boolean; reason?: string }> {
    const user = await this.findOne(identity);
    const progress = user.inProgressTracks.find((item) => item.id === payload.trackId)?.progress ?? 0;

    if (payload.sectionId > progress + 1) {
      return {
        allowed: false,
        reason: 'Complete a secao anterior primeiro.',
      };
    }

    return { allowed: true };
  }
}
