import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/module/user/entities/user.entity';
import { Role } from '@/module/role/entities/role.entity';
import { RoleModule } from '@/module/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RoleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
