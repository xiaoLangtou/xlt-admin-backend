import { WinstonLogger } from 'nest-winston';
import { Logger, QueryRunner } from 'typeorm';
import * as chalk from 'chalk';

export default class CustomTypeOrmLogger implements Logger {
  constructor(private winstonLogger: WinstonLogger) {}

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.winstonLogger.log(message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }
    this.winstonLogger.log(
      chalk.cyan(
        `${query} -- Parameters: ${this.stringifyParameters(parameters)}`,
      ),
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }
    console.trace(error);
    this.winstonLogger.error(
      chalk.red(
        `${query} `,
        `Parameters: ${this.stringifyParameters(parameters)}`,
        `${error}`,
      ),
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }
    this.winstonLogger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParameters(parameters)} -- ${query}`,
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.winstonLogger.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    this.winstonLogger.log(message);
  }

  private stringifyParameters(query?: any[]) {
    try {
      return JSON.stringify(query);
    } catch {
      return '';
    }
  }
}
