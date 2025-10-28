import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;
}