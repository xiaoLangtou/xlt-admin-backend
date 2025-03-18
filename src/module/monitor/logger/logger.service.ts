import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateLoggerDto, QueryLoggerDto } from '@/module/monitor/logger/dto/logger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@/module/monitor/logger/entities/logger.entity';
import * as UserA from 'useragent';
import { AxiosService } from '@/module/axios/axios.service';
import { CREATE_TIME_FORMAT, QUERY_ERROR_CODE } from '@/common/constant';
import { Result } from '@/common/utils/result';
import { getPagination } from '@/common/utils/utils';
import { COMMON_STATUS } from '@/common/enums';

@Injectable()
export class LoggerService {
  @InjectRepository(Logger)
  private readonly loggerRepository: Repository<Logger>;

  @Inject()
  private readonly axiosService: AxiosService;

  /**
   * 创建系统日志
   * @param request
   * @param response
   * @param timeConsume
   * @param data
   * @param requireModule
   * @param apiOperation
   */
  async createSystemLogger(
    request: any,
    response: any,
    timeConsume: string,
    data: any,
    requireModule: string,
    apiOperation?: string,
  ) {
    const userAgent = UserA.parse(request.headers['user-agent']);
    const address = await this.axiosService.getIpAddress(request.ip);
    const moduleFunc = apiOperation ? JSON.parse(JSON.stringify(apiOperation))?.summary : '';

    // 处理请求的状态
    const status = response.statusCode;

    const loggerParams: CreateLoggerDto = {
      browser: userAgent.toAgent(),
      logContent: moduleFunc ? moduleFunc : '',
      logType: 'action',
      module: requireModule,
      os: userAgent.os.toJSON().family,
      requestBody: Object.keys(request.body).length ? JSON.stringify(request.body) : '',
      requestHeader: JSON.stringify(request.headers),
      requestIp: request.ip,
      requestIpAddr: address,
      requestMethod: request.method,
      requestParam: Object.keys(request.query).length ? JSON.stringify(request.query) : '',
      requestTimeConsume: timeConsume,
      requestUrl: request.url,
      responseBody: JSON.stringify(data),
      responseHeader: JSON.stringify(response.getHeaders()),
      status:
        status !== 200
          ? COMMON_STATUS.FAIL
          : status == 200 && data.code == 0
            ? COMMON_STATUS.SUCCESS
            : COMMON_STATUS.FAIL,
    };

    return this.loggerRepository.save({ ...loggerParams, createBy: request.user?.username });
  }

  /**
   * 获取系统日志列表
   */
  async getSystemLoggerList(query: QueryLoggerDto) {
    const { current = 1, size = 10, ...otherParams } = query;

    const queryBuilder = this.loggerRepository.createQueryBuilder('logger');

    queryBuilder.where('logger.delFlag = :delFlag', { delFlag: '0' });

    queryBuilder.select([
      'logger.id as id',
      'logger.log_type as logType',
      'logger.log_content as logContent',
      'logger.request_method as requestMethod',
      'logger.request_ip as requestIp',
      'logger.request_ip_addr as requestIpAddr',
      'logger.request_time_consume as requestTimeConsume',
      'logger.browser as browser',
      'logger.os as os',
      'logger.module as module',
      CREATE_TIME_FORMAT('logger'),
      'logger.create_by  as createBy',
      'logger.status as status',
    ]);

    if (otherParams.createBy) {
      queryBuilder.andWhere('logger.create_by = :createBy', { createBy: otherParams.createBy });
    }

    if (otherParams.ip) {
      queryBuilder.andWhere('logger.request_ip = :ip', { ip: otherParams.ip });
    }

    if (otherParams.startTime && otherParams.endTime) {
      queryBuilder.andWhere('logger.create_time BETWEEN :startTime AND :endTime', {
        startTime: otherParams.startTime,
        endTime: otherParams.endTime,
      });
    }

    try {
      const count = await queryBuilder.getCount();

      const pager = getPagination(count, +current, +size);

      const list = await queryBuilder
        .offset(pager.startRow)
        .limit(pager.pageInfo.pageSize)
        .orderBy('logger.create_time', 'DESC')
        .getRawMany();

      return Result.list<Logger>(list, pager.pageInfo);
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '查询失败');
    }
  }

  async getSystemLoggerDetail(id: number) {
    const logItem = await this.loggerRepository.findOne({
      where: {
        id: id,
        delFlag: '0',
        deleteTime: null,
      },
    });

    if (!logItem) {
      return Result.fail(QUERY_ERROR_CODE, '查询失败');
    }
    return Result.ok(logItem);
  }
}
