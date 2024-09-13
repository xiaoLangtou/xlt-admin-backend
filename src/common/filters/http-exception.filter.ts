import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const request = host.switchToHttp().getRequest();

    const exceptionResponse = exception.getResponse();

    const res = exceptionResponse as { message: string[] };

    // 记录日志
    const { method, originalUrl, body, query, params, ip } = request;
    this.logger.error('HttpException', {
      res: {
        status,
        message: JSON.stringify(res),
      },
      req: {
        method,
        url: originalUrl,
        body,
        query,
        params,
        ip,
      },
    });

    response
      .status(status)
      .header('Content-Type', 'application/json; charset=utf-8')
      .json({
        code: status,
        message: res?.message?.join
          ? res?.message?.join(',')
          : exception.message,
        data: null,
      });

    this.logger.debug('-----------Request end----------');
  }
}
