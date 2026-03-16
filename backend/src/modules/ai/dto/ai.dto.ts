import { IsOptional, IsString } from 'class-validator';

export class GenerateChatDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  context?: string;
}

export class GenerateTrackDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  context?: string;
}

export class GenerateSectionDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  context?: string;
}

export class GenerateImageDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  context?: string;
}
