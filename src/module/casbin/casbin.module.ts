import { Global, Module } from '@nestjs/common';
import { CasbinService } from './casbin.service';
import { ConfigService } from '@nestjs/config';
import TypeORMAdapter from 'typeorm-adapter';
import { newEnforcer } from 'casbin';
import { CasbinRuleEntity } from '@/module/casbin/entities/casbin.entity';
import { join } from 'path';

@Global()
@Module({
  providers: [
    CasbinService,
    {
      provide: 'CASBIN_ENFORCER',
      useFactory: async (configService: ConfigService) => {
        const adapter = await TypeORMAdapter.newAdapter(
          {
            type: 'mysql',
            host: configService.get('db.mysql.host'),
            port: configService.get('db.mysql.port'),
            username: configService.get('db.mysql.user'),
            password: configService.get('db.mysql.password'),
            database: configService.get('db.mysql.database'),
          },
          { customCasbinRuleEntity: CasbinRuleEntity },
        );

        const enforcer = await newEnforcer(join(__dirname, '../../config/model.conf'), adapter);
        await enforcer.loadPolicy();
        return enforcer;
      },
      inject: [ConfigService],
    },
  ],
  exports: [CasbinService],
})
export class CasbinModule {}
