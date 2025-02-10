/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2024-12-25 10:57:34
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2024-12-25 11:36:45
 * @FilePath: src/common/utils/controller-discovery.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ModulesContainer } from '@nestjs/core';

export class ControllerDiscovery {
  static getAllControllers(app: INestApplication) {
    const modulesContainer = app.select(AppModule).get(ModulesContainer);

    return (
      Array.from(modulesContainer.entries())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .flatMap(([_, module]) => Array.from(module.controllers.values()))
        .map((controller) => controller.metatype)
        .filter((controller) => controller.name !== 'HealthCheckController')
    ); // 过滤内置控制器
  }

  static getControllersByModule(app: INestApplication, moduleName: string) {
    const modulesContainer = app.select(AppModule).get(ModulesContainer);

    const module = Array.from(modulesContainer.entries()).find(([key]) => key === moduleName);
    if (!module) {
      return [];
    }

    return Array.from(module[1].controllers.values()).map((controller) => controller.metatype);
  }
}
