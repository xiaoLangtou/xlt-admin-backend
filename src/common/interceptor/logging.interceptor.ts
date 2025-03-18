/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-03-18 14:17:21
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-03-18 14:41:05
 * @FilePath: src/common/interceptor/logging.interceptor.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as chalk from 'chalk';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, params, query, body } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime;

        // 美化日志输出
        this.logger.log(`\n${chalk.bold.green('----- 请求信息 -----')}`);
        this.logger.log(`${chalk.blue('Method')}: ${method}`);
        this.logger.log(`${chalk.blue('URL')}: ${url}`);
        this.logger.log(`${chalk.blue('IP')}: ${ip}`);
        this.logger.log(`${chalk.blue('Duration')}: ${duration}ms`);
        this.logger.log(`${chalk.blue('Status')}: ${response?.statusCode || 'N/A'}`);

        // 以漂亮的格式输出参数和请求体
        this.logger.log(`${chalk.bold.yellow('Params:')}\n${this.formatJSON(params)}`);
        this.logger.log(`${chalk.bold.yellow('Query:')}\n${this.formatJSON(query)}`);
        this.logger.log(`${chalk.bold.yellow('Body:')}\n${this.formatJSON(body)}`);
      })
    );
  }

  // 格式化 JSON 数据，使其在日志中更美观
  private formatJSON(data: any): string {
    try {
      if (data) {
        return chalk.gray(JSON.stringify(data, null, 2)); // 缩进显示 JSON 数据
      }
      return chalk.gray('No data');
    } catch {
      return chalk.gray('Error formatting data');
    }
  }
}
