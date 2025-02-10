import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { FormatResponseInterceptor } from '@/common/interceptor/format-response.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

import './common/data-source';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import * as chalk from 'chalk';
import { PostInterceptor } from '@/common/interceptor/post.interceptor';
import { SwaggerSyncService } from '@/module/swagger-sync/swagger-sync.service';

function registerInterceptor(app, interceptors) {
  for (const interceptor of interceptors) {
    app.useGlobalInterceptors(new interceptor());
  }
}

function registerFilters(app, filters) {
  for (const filter of filters) {
    app.useGlobalFilters(new filter());
  }
}

// 设置swagger
function swaggerConfig(app: NestExpressApplication) {
  const swaggerSyncService = app.get(SwaggerSyncService);
  return swaggerSyncService.createSwaggerDocument(app);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 获取配置服务
  const configService = app.get(ConfigService);

  // 开启跨域
  app.enableCors();

  // 静态资源目录
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' });

  // 设置全局前缀
  app.setGlobalPrefix(configService.get<string>('application.prefix', { infer: true }));

  // web安全
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
    }),
  );

  // 设置日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局启用验证管道 transform: true 表示将传入的参数转换为 dto指定的类型
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 注册拦截器
  registerInterceptor(app, [FormatResponseInterceptor, PostInterceptor]);

  // 注册过滤器
  registerFilters(app, [HttpExceptionFilter]);

  const swaggerPath = swaggerConfig(app);

  // 获取真实的ip地址

  // 监听端口
  const port = configService.get('application.port') || 3000;
  const prefix = configService.get('application.prefix') || '';
  await app.listen(port);

  console.log('\n');
  console.log(chalk.bgHex('#FFD4CB').black(' Nest-Admin 服务启动成功 '));
  console.log(chalk.bgGreen.black('服务地址:') + chalk.inverse.underline(`http://localhost:${port}${prefix}/`));
  console.log(chalk.bgGreen.black('swagger 文档地址:') + chalk.inverse.underline(swaggerPath));
  console.log('\n');
}

bootstrap();
