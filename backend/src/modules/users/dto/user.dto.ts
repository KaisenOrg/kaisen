import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class FollowerDto {
  @IsString()
  userIdentity!: string;

  @IsString()
  timestamp!: string;
}

export class TrackProgressDto {
  @IsString()
  id!: string;

  @IsInt()
  @Min(0)
  progress!: number;
}

export class CreateUserDto {
  @IsString()
  identity!: string;

  @IsOptional()
  @IsString()
  picture?: string | null;

  @IsString()
  nickname!: string;

  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  about?: string | null;

  @IsOptional()
  @IsString()
  role?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FollowerDto)
  followers!: FollowerDto[];

  @IsArray()
  @IsString({ each: true })
  following!: string[];

  @IsArray()
  @IsString({ each: true })
  certificates!: string[];

  @IsArray()
  @IsString({ each: true })
  createdTracks!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackProgressDto)
  inProgressTracks!: TrackProgressDto[];

  @IsArray()
  @IsString({ each: true })
  completedTracks!: string[];
}

export class UpdateUserDto extends CreateUserDto {}

export class CheckSectionAccessDto {
  @IsString()
  trackId!: string;

  @IsInt()
  @Min(1)
  sectionId!: number;
}
