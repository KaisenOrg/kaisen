import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  initialMessage!: string;
}

export class AddInteractionDto {
  @IsString()
  user!: string;

  @IsString()
  model!: string;
}
