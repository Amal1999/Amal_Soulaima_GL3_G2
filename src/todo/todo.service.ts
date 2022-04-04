import { Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from "typeorm";
import { TodoEntity } from './Entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTodoDto } from './update-todo.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { SearchTodoDto } from './dto/search-todo.dto';
import { copyFileSync } from 'fs';
import { take } from 'rxjs';
import { StatsDto } from './dto/stats.dto';

@Injectable()
export class TodoService {

  //Exercice 3
  findByStats(statsDto: StatsDto): Promise<any> {

    const qb = this.todoRepository.createQueryBuilder("todo");

    //date1 < date2 (YYYY-MM-DD) format tested
    if(statsDto.date1&&statsDto.date2)
    return qb.select("status,count(*) ")
    .where(`createdAt BETWEEN '${statsDto.date1}' AND '${statsDto.date2}'`)
    .groupBy("status")
    .getRawMany();

    //date1 and date2 are null
    return qb.select("status,count(*) ")
    .groupBy("status")
    .getRawMany();
  }
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
  ) {}
  addTodo(todo: Partial<TodoEntity>): Promise<TodoEntity> {
    return this.todoRepository.save(todo);
  }

  async updateTodo(
    updateTodoDto: UpdateTodoDto,
    id: string,
  ): Promise<TodoEntity> {
    const newTodo = await this.todoRepository.preload({ id, ...updateTodoDto });
    if (newTodo) {
      return this.todoRepository.save(newTodo);
    } else {
      throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
    }
  }

  async deleteTodo(id: string): Promise<DeleteResult> {
    const result = await this.todoRepository.delete(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }
  async softDeleteTodo(id: string): Promise<UpdateResult> {
    const result = await this.todoRepository.softDelete(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }

  async softRestoreTodo(id: string) {
    const result = await this.todoRepository.restore(id);
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas `);
  }

  findAll(searchTodoDto: SearchTodoDto): Promise<TodoEntity[]> {
    const criterias = [];
    const firstCondition:any ={};
    const secondCondition:any ={};
    var test:any={};

    if (searchTodoDto.status) {
      firstCondition.status = searchTodoDto.status;
      secondCondition.status = searchTodoDto.status;
    }

    if (searchTodoDto.criteria) {
      firstCondition.name = Like(`%${searchTodoDto.criteria}%`);
      secondCondition.description= Like(`%${searchTodoDto.criteria}%`);
    }

    // offset doesn't work without take
    if(searchTodoDto.take)
    {
      if(searchTodoDto.skip)
      {
        test.skip = searchTodoDto.skip;
      }
      test.take = searchTodoDto.take;
    }


    criterias.push(firstCondition);
    criterias.push(secondCondition);
    

    if (criterias.length) {
      return this.todoRepository.find({ withDeleted: true ,where: criterias,skip:test.skip??0,take:test.take??0});
    }
    return this.todoRepository.find({ withDeleted: true});
  }
}
