import 'reflect-metadata';

/**
 * 定义ApiTag装饰器
 */
export function CustomApiTags(tag: string) {
  return (target: any) => {
    Reflect.defineMetadata('api:tags', tag, target);
  };
}

/**
 * 定义ApiOperation装饰器
 */
export function CustomApiOperation(options: { summary: string; description?: string }) {
  return (target: any, propertyKey: string, description: PropertyDescriptor) => {
    Reflect.defineMetadata('api:operation', options, target, propertyKey);
  };
}

/**
 * 定义ApiResponse装饰器
 */

export function CustomApiResponse(options: { status: number; description: string }) {
  return (target: any, propertyKey: string) => {
    const responses = Reflect.getMetadata('api:responses', target, propertyKey) || [];
    responses.push(options);
    Reflect.defineMetadata('api:responses', responses, target, propertyKey);
  };
}
