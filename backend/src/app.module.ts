import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './common/config/env.validation';
import { HealthController } from './health.controller';
import { AiModule } from './modules/ai/ai.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ChatsModule } from './modules/chats/chats.module';
import { DatabaseModule } from './modules/database/database.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    UsersModule,
    TracksModule,
    ChatsModule,
    CertificatesModule,
    AiModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
