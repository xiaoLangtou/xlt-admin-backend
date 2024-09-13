import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userAgent = request.headers['user-agent'];
    const { ip, method, path } = request;
    this.logger.debug(
      `-----------------${context.getHandler().name} Request Start------------`,
    );
    this.logger.log(
      `[${method}] ${path} - ${ip} - ${userAgent} : ${context.getClass().name} - ${context.getHandler().name}`,
    );

    this.logger.log(
      `user: ${request.user?.userId} , ${request.user?.username}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.log(
          `${method} ${path} - ${ip} - ${userAgent} : ${response.statusCode} : ${Date.now() - now}ms`,
        );
        this.logger.log(`Response: ${JSON.stringify(res)}`);

        this.logger.debug(`-----------------Request End------------`);
      }),
    );
  }
}
