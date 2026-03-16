import { IsNumber, IsString, Min } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  owner!: string;

  @IsString()
  trackName!: string;

  @IsNumber()
  @Min(0)
  timeSpentHours!: number;
}
