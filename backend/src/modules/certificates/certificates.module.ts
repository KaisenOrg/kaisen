import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CertificateSvgFactory } from './certificate-svg.factory';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CertificatesController],
  providers: [CertificatesService, CertificateSvgFactory],
  exports: [CertificatesService],
})
export class CertificatesModule {}
