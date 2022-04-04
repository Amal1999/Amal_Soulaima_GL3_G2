import { TodoStatusEnum } from '../enums/todo-status.enum';
import { IsDate, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

//Exercice 3
export class StatsDto {
  @IsOptional()
  date1 : String;
  @IsOptional()
  date2 : String;
}
