/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2024-12-25 10:44:18
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2024-12-25 11:34:44
 * @FilePath: src/common/utils/swagger-generator.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import { Injectable } from '@nestjs/common';
import 'reflect-metadata';

@Injectable()
export class SwaggerGenerator {
  /**
   * 解析控制器元数据生成OpenAPI规范
   */
  static generate(controllers: Function[]): any {
    const paths = {};

    controllers.forEach((controller) => {
      const tag = Reflect.getMetadata('api:tags', controller);
      const proto = controller.prototype;
      const methods = Object.getOwnPropertyNames(proto).filter((method) => method !== 'constructor');
      methods.forEach((method) => {
        const operation = Reflect.getMetadata('api:operation', proto, method);
        const responses = Reflect.getMetadata('api:responses', proto, method) || [];

        if (operation) {
          const path = `/${controller.name.toLowerCase().replace('controller', '')}`;
          paths[path] = paths[path] || {};
          console.log(method);
          paths[path][method] = {
            tags: [tag],
            summary: operation.summary,
            description: operation.description,
            responses: responses.reduce((acc, cur) => ({ ...acc, [cur.status]: { description: cur.description } }), {}),
          };
        }
      });
    });

    return {
      openapi: '3.0.0',
      info: {
        title: 'Custom NestJS Swagger',
        version: '1.0.0',
      },
      paths,
    };
  }
}
