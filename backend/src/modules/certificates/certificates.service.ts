import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { CertificateRecord } from '../database/database.types';
import { CertificateSvgFactory } from './certificate-svg.factory';
import { CreateCertificateDto } from './dto/certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly certificateSvgFactory: CertificateSvgFactory,
  ) {}

  async create(payload: CreateCertificateDto): Promise<CertificateRecord> {
    return this.databaseService.write((state) => {
      const certificate: CertificateRecord = {
        id: `certificate-${randomUUID().slice(0, 8)}`,
        owner: payload.owner,
        trackName: payload.trackName,
        timeSpentHours: payload.timeSpentHours,
        createdAt: new Date().toISOString(),
        svg: this.certificateSvgFactory.create(
          payload.owner,
          payload.trackName,
          payload.timeSpentHours,
        ),
      };

      state.certificates.unshift(certificate);
      const user = state.users.find((item) => item.identity === payload.owner);
      if (user && !user.certificates.includes(certificate.id)) {
        user.certificates.unshift(certificate.id);
      }

      return certificate;
    });
  }

  async findOne(id: string): Promise<CertificateRecord> {
    const certificate = await this.databaseService.read((state) =>
      state.certificates.find((item) => item.id === id),
    );

    if (!certificate) {
      throw new NotFoundException(`Certificate ${id} was not found.`);
    }

    return certificate;
  }
}
