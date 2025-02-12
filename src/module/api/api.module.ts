import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AxiosModule } from '@/module/axios/axios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Api } from '@/module/api/entities/api.entity';
import { ApiIgnore } from '@/module/api/entities/api-ignore.entity';

@Module({
  imports: [AxiosModule, TypeOrmModule.forFeature([Api,ApiIgnore])],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
