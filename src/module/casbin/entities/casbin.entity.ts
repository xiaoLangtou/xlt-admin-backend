import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { CasbinRule } from 'typeorm-adapter';

@Entity({
  name: 'sys_casbin_rule',
  comment: 'casbin规则表',
})
export class CasbinRuleEntity extends CasbinRule {
  @CreateDateColumn({
    name: 'created_date',
    comment: '创建时间',
  })
  createdDate: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    comment: '更新时间',
  })
  updatedDate: Date;
}
