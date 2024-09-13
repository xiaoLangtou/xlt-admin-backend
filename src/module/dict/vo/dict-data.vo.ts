interface IDictType {
  id?: string | number;
  dictName: string;
  dictCode: string;
  systemFlag?: string;
}

export class DictDataVo {
  id: number;
  dictValue: string;
  dictLabel: string;
  dictRemark: string;
  dictSort: number;
  dictType: IDictType;
}
