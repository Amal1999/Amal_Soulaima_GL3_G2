import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, In, Like, Repository } from "typeorm";
import { TodoEntity } from './Entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTodoDto } from './update-todo.dto';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { SearchTodoDto } from './dto/search-todo.dto';
import { TodoStatusEnum } from './enums/todo-status.enum';
import { resourceLimits } from 'worker_threads';

let nbrelement=3;
@Injectable()
export class TodoService {
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
    if (searchTodoDto.status) {
      criterias.push({ status: searchTodoDto.status });
    }
    if (searchTodoDto.criteria) {
      criterias.push({ name: Like(`%${searchTodoDto.criteria}%`) });
      criterias.push({ description: Like(`%${searchTodoDto.criteria}%`) });
    }
    if (criterias.length) {
      return this.todoRepository.find({ withDeleted: true, where: criterias });
    }
    return this.todoRepository.find({ withDeleted: true});
  }


  //avec pagination
  async findby(chaine:string,status:TodoStatusEnum,page: number): Promise<TodoEntity[]> {
    
    if(chaine==null && status==null){
      return  this.todoRepository.find({ withDeleted: false,
        take:nbrelement,
        skip:page*nbrelement,
      });
     }
     else 
     {
      if(status!=null)
      {
       return this.todoRepository.query("select * from todo where name like '%"+chaine+"%' OR description like '%"+chaine+"%' and status like '"+status+"' limit "+nbrelement+" offset "+(page-1)*nbrelement+"");
 
      }
      else
      return this.todoRepository.query("select * from todo where name like '%"+chaine+"%' OR description like '%"+chaine+"%' and status like '"+status+"' limit "+nbrelement+" offset "+(page-1)*nbrelement+"");
     }
  

   /* 
let result= this.todoRepository.findBy({
  name: Like(`%${chaine}%`),
// description: Like(`%${chaine}%`),
 status: status,
 //take:nbrelement,
 //skip:page*nbrelement,
  })
   if((await result).length>0)
     return result;

        else{
          result=this.todoRepository.findBy({
            //name: Like(`%${chaine}%`),
          description: Like(`%${chaine}%`),
           status: status,
            })
          if( (await result).length>0)
          return result;
          
                  }*/
}

  async findnbrstatus(date1:Date,date2:Date){
  var jsonObj = {};
  let i
        for (let statuss in TodoStatusEnum) {
        //  jsonObj[statuss]=TodoStatusEnum[statuss];
        i= await this.todoRepository.countBy({
          status: TodoStatusEnum[statuss]
        });
           jsonObj[TodoStatusEnum[statuss]]=i;
        }
       // if(date1!=null&&date2!=null)
       // jsonObj["status"]=await this.todoRepository.query("select * from todo where todo.createdAt between '"+date1+"' and '"+date2+"'");

        jsonObj["status"]=await this.todoRepository
        .createQueryBuilder('todo')
        .where('todo.createdAt between :date1 AND :date2', { date1,date2 })
        .select([' DISTINCT todo.status'])
        .printSql()
        .getRawMany();
return jsonObj;
}


}
