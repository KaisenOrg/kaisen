import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class FlashcardItemDto {
  @IsString()
  sentence!: string;

  @IsString()
  answer!: string;
}

export class QuizAlternativeDto {
  @IsInt()
  @Min(1)
  id!: number;

  @IsString()
  text!: string;
}

export class QuizItemDto {
  @IsString()
  question!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAlternativeDto)
  alternatives!: QuizAlternativeDto[];

  @IsInt()
  @Min(1)
  correctAnswerId!: number;
}

export class EssayItemDto {
  @IsString()
  question!: string;

  @IsString()
  expectedAnswer!: string;
}

export class SectionContentDto {
  @IsString()
  type!: 'Page' | 'Flashcard' | 'Quiz' | 'Essay';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlashcardItemDto)
  cards?: FlashcardItemDto[];

  @IsOptional()
  @IsArray()
  questions?: Array<QuizItemDto | EssayItemDto>;
}

export class TrackSectionDto {
  @IsInt()
  @Min(1)
  id!: number;

  @IsString()
  title!: string;

  @ValidateNested()
  @Type(() => SectionContentDto)
  content!: SectionContentDto;
}

export class CreateTrackDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  authorId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackSectionDto)
  sections!: TrackSectionDto[];
}

export class UpdateTrackDto extends CreateTrackDto {}

export class UpdateTrackSectionDto {
  @ValidateNested()
  @Type(() => TrackSectionDto)
  section!: TrackSectionDto;
}
