import { Global, Module } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import { LoginLogController } from './login-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLog } from '@/module/monitor/login-log/entities/login-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginLog])],
  controllers: [LoginLogController],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
