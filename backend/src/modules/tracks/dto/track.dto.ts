import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsIn,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class FlashcardItemDto {
  @IsString()
  @IsNotEmpty()
  sentence!: string;

  @IsString()
  @IsNotEmpty()
  answer!: string;
}

export class QuizAlternativeDto {
  @IsInt()
  @Min(1)
  id!: number;

  @IsString()
  @IsNotEmpty()
  text!: string;
}

export class QuizItemDto {
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsNotEmpty()
  expectedAnswer!: string;
}

export class SectionContentDto {
  @IsIn(['Page', 'Flashcard', 'Quiz', 'Essay'])
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
  @IsNotEmpty()
  title!: string;

  @ValidateNested()
  @Type(() => SectionContentDto)
  content!: SectionContentDto;
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  authorId!: string;

  @IsArray()
  @ArrayMinSize(1)
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
