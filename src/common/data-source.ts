import config from '../config/config';
import { User } from '@/module/user/entities/user.entity';
import { Role } from '@/module/role/entities/role.entity';
import { DataSource } from 'typeorm';
import { Menu } from '@/module/menu/entities/menu.entity';

const {
  db: { mysql },
} = config();

export default new DataSource({
  type: 'mysql',
  host: mysql.host,
  port: mysql.port,
  username: mysql.user,
  password: mysql.password,
  database: mysql.database,
  synchronize: false,
  logging: true,
  entities: [User, Role, Menu],
  poolSize: 10,
  migrations: ['src/migrations/*.ts'],
  connectorPackage: 'mysql2',
  extra: {
    // authPlugin: 'sha256_password',
  },
});
