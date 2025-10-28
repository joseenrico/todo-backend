import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { OpenAI } from 'openai';
import { Todo } from './entities/todo.entity';
import { TodoStatus } from './entities/todo-status.enum';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  private openai: OpenAI | undefined;
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async findAll(userId: string, search?: string): Promise<Todo[]> {
    const where: any = { user_id: userId };
    if (search) {
      where.title = Like(`%${search}%`);
    }
    return this.todoRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      user_id: userId,
    });

    return this.todoRepository.save(todo);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.status = updateTodoDto.status;
    if (updateTodoDto.problem_desc !== undefined) {
      todo.problem_desc = updateTodoDto.problem_desc || null;
    }
    if (
      updateTodoDto.status === TodoStatus.PROBLEM &&
      updateTodoDto.problem_desc &&
      this.openai
    ) {
      try {
        const aiRecommendation = await this.generateAIRecommendation(
          todo.title,
          updateTodoDto.problem_desc,
        );
        todo.ai_recommendation = aiRecommendation;
      } catch (error) {
        console.error('OpenAI Error:', error.message);
        todo.ai_recommendation = 'AI recommendation unavailable';
      }
    } else {
      todo.ai_recommendation = null;
    }

    return this.todoRepository.save(todo);
  }

  private async generateAIRecommendation(
    title: string,
    problemDesc: string,
  ): Promise<string> {
    if (!this.openai) {
        throw new Error("OpenAI client is not initialized.");
    }
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that provides concise, actionable recommendations for solving problems related to tasks or todos. Keep responses under 150 words.',
        },
        {
          role: 'user',
          content: `Task: "${title}"\nProblem: "${problemDesc}"\n\nProvide a brief recommendation to solve this problem.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI.");
    }
    return content.trim();
  }
}