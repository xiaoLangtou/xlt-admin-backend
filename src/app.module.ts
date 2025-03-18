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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PermissionGuard } from '@/common/guard/permission.guard';
import { MenuModule } from '@/module/menu/menu.module';

import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { AuthModule } from '@/module/auth/auth.module';
import { DictModule } from './module/dict/dict.module';
import CustomTypeormLogger from '@/common/typeorm-logger/custom-typeorm-logger';
import 'winston-daily-rotate-file';
import { RoleModule } from './module/role/role.module';
import { DeptModule } from './module/dept/dept.module';
import { PostModule } from './module/post/post.module';
import { LoginLogModule } from './module/monitor/login-log/login-log.module';
import { AxiosModule } from './module/axios/axios.module';
import { CasbinModule } from './module/casbin/casbin.module';
import { ApiModule } from './module/api/api.module';
import { LoggerModule } from '@/module/monitor/logger/logger.module';
import { InvokeRecordInterceptor } from '@/common/interceptor/invoke-record.interceptor';
import { RedisCacheModule } from './module/monitor/redis-cache/redis-cache.module';
import { SwaggerSyncModule } from './module/swagger-sync/swagger-sync.module';
import { LoggingInterceptor } from '@/common/interceptor/logging.interceptor';
import { CustomWinstonModule } from './common/winston/winston.module';

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
          logger: new CustomTypeormLogger(logger),
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
    CasbinModule,
    ApiModule,
    LoggerModule,
    RedisCacheModule,
    SwaggerSyncModule,
    CustomWinstonModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: InvokeRecordInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
