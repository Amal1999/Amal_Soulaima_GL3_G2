import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './Entities/cv.entity';
@Module({
  controllers: [CvController],
  imports: [TypeOrmModule.forFeature([Cv])],
 
  providers: [CvService]
})
export class CvModule {}
