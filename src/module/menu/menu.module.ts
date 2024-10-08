import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '@/module/menu/entities/menu.entity';
import { RoleModule } from '@/module/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), RoleModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
