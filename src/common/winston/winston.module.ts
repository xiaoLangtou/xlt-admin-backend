import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston.config'; // 你的 winston 配置

@Module({
  imports: [
    WinstonModule.forRootAsync(winstonConfig),
  ],
  providers: [],
  exports: [WinstonModule], // 必须 export 让其他模块使用
})
export class CustomWinstonModule {}
