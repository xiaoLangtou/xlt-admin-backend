import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { UserModule } from '@/module/user/user.module';
import { RedisModule } from '@/module/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '@/module/email/email.module';
import config from './config/config';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { LoginGuard } from '@/common/guard/login.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from '@/common/guard/permission.guard';
import { MenuModule } from '@/module/menu/menu.module';

import {
  utilities,
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonLogger,
  WinstonModule,
  WinstonModuleAsyncOptions,
} from 'nest-winston';
import { AuthModule } from '@/module/auth/auth.module';
import { DictModule } from './module/dict/dict.module';
import * as winston from 'winston';
import CustomTypeOrmLogger from '@/common/CustomTypeOrmLogger';
import 'winston-daily-rotate-file';
import { RoleModule } from './module/role/role.module';
import { DeptModule } from './module/dept/dept.module';
import { PostModule } from './module/post/post.module';
import { LoginLogModule } from './module/monitor/login-log/login-log.module';
import { AxiosModule } from './module/axios/axios.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.access_token_expires'),
          },
        };
      },
      inject: [ConfigService],
    } as JwtModuleAsyncOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: WinstonLogger) => {
        return {
          type: 'mysql',
          timezone: '+08:00',
          host: configService.get('db.mysql.host'),
          port: configService.get('db.mysql.port'),
          username: configService.get('db.mysql.user'),
          password: configService.get('db.mysql.password'),
          database: configService.get('db.mysql.database'),
          synchronize: true,
          logging: configService.get('db.mysql.logging', true),
          logger: new CustomTypeOrmLogger(logger),
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          autoLoadEntities: true,
          keepConnectionAlive: true,
          poolSize: configService.get('db.mysql.pool_size', 10),
          connectorPackage: 'mysql2',
          extra: {
            // authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    } as TypeOrmModuleAsyncOptions),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: 'debug',
        levels: { ...winston.config.syslog.levels, sql: 8 },
        transports: [
          new winston.transports.DailyRotateFile({
            ...configService.get('application.logger.info'),
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf((logs) => {
                const { timestamp, level, message } = logs;
                return `[${timestamp}] [${level}]: ${message.replace(/\u001b\[[0-9;]*m/g, '')}\r\n`;
              }),
            ),
          }),
          new winston.transports.DailyRotateFile({
            ...configService.get('application.logger.error'),
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf((logs) => {
                const { timestamp, level, message, stack } = logs;
                return `[${timestamp}] [${level}]: ${message.replace(/\u001b\[[0-9;]*m/g, '')}\r\n[stack]: ${JSON.stringify(stack)}\r\n`;
              }),
            ),
          }),
          new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
          }),
        ],
      }),
      inject: [ConfigService],
    } as WinstonModuleAsyncOptions),
    UserModule,
    RedisModule,
    EmailModule,
    MenuModule,
    AuthModule,
    DictModule,
    RoleModule,
    DeptModule,
    PostModule,
    LoginLogModule,
    AxiosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
