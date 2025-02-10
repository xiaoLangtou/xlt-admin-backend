import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '@/module/monitor/logger/logger.service';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);
  @Inject()
  private reflector: Reflector;

  @Inject()
  private sysLoggerService: LoggerService;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userAgent = request.headers['user-agent'];
    const { ip, method, path } = request;
    this.logger.debug(`-----------------${context.getHandler().name} 请求开始------------`);
    this.logger.log(
      `[${method}] ${path} - ${ip} - ${userAgent} : ${context.getClass().name} - ${context.getHandler().name}`,
    );

    this.logger.log(`user: ${request.user?.userId} , ${request.user?.username}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        this.logger.log(`[${method}] ${path} - 状态： ${response.statusCode} - 请求耗时： ${Date.now() - now}ms`);
        // 将日志记录到数据库中
        this.recordDatabase(context, request, response, `${Date.now() - now}ms`, data);
        this.logger.debug(`-----------------请求结束------------`);
      }),
    );
  }

  // 记录数据库
  private recordDatabase(context: ExecutionContext, request: any, response: any, timeConsume: string, data: any) {
    const requireModule = this.reflector.getAllAndOverride('swagger/apiUseTags', [
      context.getClass(),
      context.getHandler(),
    ]);
    const apiOperation = this.reflector.getAllAndOverride('swagger/apiOperation', [
      context.getClass(),
      context.getHandler(),
    ]);

    this.sysLoggerService
      .createSystemLogger(request, response, timeConsume, data, requireModule, apiOperation)
      .then(() => {
        this.logger.debug(`日志记录成功`);
      })
      .catch(() => {
        this.logger.error(`日志记录失败`);
      });
  }
}
