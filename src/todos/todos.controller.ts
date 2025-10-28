import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Query('search') search: string, @Req() req: any) {
    return this.todosService.findAll(req.userId, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.todosService.findOne(+id, req.userId);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: any) {
    return this.todosService.create(createTodoDto, req.userId);
  }
  
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ) {
    return this.todosService.update(+id, updateTodoDto, req.userId);
  }
}