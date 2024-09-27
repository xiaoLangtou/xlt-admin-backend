import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginLog } from '@/module/monitor/login-log/entities/login-log.entity';
import { Repository } from 'typeorm';
import { CreateLoginLogDto } from '@/module/monitor/login-log/dto/create-login-log.dto';
import { AxiosService } from '@/module/axios/axios.service';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLog)
    private readonly loginLogRepository: Repository<LoginLog>,

    @Inject(AxiosService) private readonly axiosService: AxiosService,
  ) {}

  async create(createLoginLogDto: CreateLoginLogDto) {
    const loginLog = this.loginLogRepository.create(createLoginLogDto);
    loginLog.loginLocation = await this.axiosService.getIpAddress(loginLog.ipaddr);

    return await this.loginLogRepository.save(loginLog);
  }
}
