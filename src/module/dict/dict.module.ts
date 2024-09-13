import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dict } from '@/module/dict/entities/dict.entity';
import { DictData } from '@/module/dict/entities/dict-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dict, DictData])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
