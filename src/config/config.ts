import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'node:process';

const environmentVariable = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

const ENV = process.env.NODE_ENV || 'development';

console.log('当前环境变量：', ENV);

export default () => {
  return yaml.load(
    readFileSync(
      join(__dirname, `./${environmentVariable[ENV]}.env.yaml`),
      'utf8',
    ),
  ) as Record<string, any>;
};
