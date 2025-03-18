import { Logger, QueryRunner } from 'typeorm';
import { WinstonLogger } from 'nest-winston';

import * as chalk from 'chalk';


import sqlFormatter from 'sql-formatter';


const { blue, green, yellow, red, magenta, cyan, gray } = chalk;


export default class CustomTypeormLogger implements Logger {
  constructor(private readonly winstonLogger: WinstonLogger) {}

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.winstonLogger.log({ level, message });
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }

    const formattedQuery = this.formatSQL(query);
    const formattedParams = this.stringifyParameters(parameters);

    this.winstonLogger.log({
      level: 'info',
      message: `\n📌 ${blue.bold('SQL Query')}\n${green(formattedQuery)}\n📌 ${blue.bold('Parameters')}: ${formattedParams}\n`,
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }

    const formattedQuery = this.formatSQL(query);
    const formattedParams = this.stringifyParameters(parameters);
    const errorMessage = typeof error === 'string' ? error : error.message;

    this.winstonLogger.error({
      level: 'error',
      message: `\n❌ ${red.bold('Query Failed!')}\n🔻 ${green(formattedQuery)}\n🔻 ${yellow.bold('Parameters')}: ${formattedParams}\n🔻 ${red.bold('Error')}: ${errorMessage}\n`,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (queryRunner?.data?.isCreatingLogs) {
      return;
    }

    const formattedQuery = this.formatSQL(query);
    const formattedParams = this.stringifyParameters(parameters);

    this.winstonLogger.warn({
      level: 'warn',
      message: `\n🐢 ${magenta.bold('Slow Query Warning!')} (${time} ms)\n🔻 ${green(formattedQuery)}\n🔻 ${yellow.bold('Parameters')}: ${formattedParams}\n`,
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.winstonLogger.log({
      level: 'info',
      message: `🏗️ ${cyan.bold('Schema Build')}: ${message}\n`,
    });
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.winstonLogger.log({
      level: 'info',
      message: `🚀 ${cyan.bold('Migration')}: ${message}\n`,
    });
  }

  /**
   * 格式化 SQL 语句，使其更清晰易读
   */
  private formatSQL(query: string): string {
    try {
      return sqlFormatter.format(query, { language: 'sql' });
    } catch {
      return query; // 失败时返回原始 SQL
    }
  }

  /**
   * 让 `Parameters` 保持在一行，输出 `JSON.stringify` 但不换行
   */
  private stringifyParameters(parameters?: any[]) {
    if (!parameters || parameters.length === 0) {
      return green('[]');
    }
    try {
      return yellow(JSON.stringify(parameters)); // 保持单行输出
    } catch {
      return green('[Could not parse parameters]');
    }
  }
}
