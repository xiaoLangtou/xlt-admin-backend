import { Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SwaggerSyncService {

  private swaggerDocument: OpenAPIObject;


  constructor(private readonly configService: ConfigService) {
  }

  createSwaggerDocument(app) {
    const prefix = this.configService.get('application.prefix') || '';
    const host = this.configService.get('swagger.host') || 'localhost';
    const title = this.configService.get('swagger.title') || 'Nest-Admin';
    const description = this.configService.get('swagger.description') || 'Nest-Admin API 文档';
    const version = this.configService.get('swagger.version') || '1.0';
    const basePath = this.configService.get('swagger.basePath') || 'api-docs';
    const config = new DocumentBuilder().setTitle(title).setDescription(description).setVersion(version).build();

    this.swaggerDocument = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(basePath, app, this.swaggerDocument);
    return `http://${host}${prefix}/${basePath}`;
  }

  // 解析接口数据
  getApiList() {
    const apiList = [];
    const paths = this.swaggerDocument.paths ?? {};
    // 循环遍历apiPath
    for (const key in paths) {
      if (Object.prototype.hasOwnProperty.call(paths, key)) {
        const element = paths[key];
        for (const method in element) {
          if (Object.prototype.hasOwnProperty.call(element, method)) {
            const item = element[method];
            const apiItem = {
              path: key,
              method: method.toLocaleUpperCase(),
              description: item.summary,
              apiGroup: item.tags && item.tags[0],
            };
            apiList.push(apiItem);
          }
        }
      }
    }
    return apiList;
  }

}
