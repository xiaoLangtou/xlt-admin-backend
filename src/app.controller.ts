import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CasbinService } from '@/module/casbin/casbin.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly casbinService: CasbinService,
  ) {}

}
