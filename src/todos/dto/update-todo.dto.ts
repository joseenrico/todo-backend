import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class UpdateTodoDto {
  @IsEnum(TodoStatus, { message: 'Invalid status value' })
  status: TodoStatus;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.status === TodoStatus.PROBLEM)
  problem_desc?: string;
}