import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './Entities/skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SkillsController],
  imports: [TypeOrmModule.forFeature([Skill])],
 

  providers: [SkillsService]
})
export class SkillsModule {}
