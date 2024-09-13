import { ApiProperty } from '@nestjs/swagger';
import { IPage } from '@/common/utils/pager';

export const SUCCESS_CODE = 0;

export class Result {
  @ApiProperty({ type: Number, description: '状态码' })
  code: number;

  @ApiProperty({ type: String, description: '消息体' })
  message?: string;

  @ApiProperty({ type: Object, description: '数据体' })
  data?: any;

  constructor(code = SUCCESS_CODE, message = '', data = null) {
    this.code = code;
    this.message = message || (code === SUCCESS_CODE ? 'success' : 'error');
    this.data = data;
  }

  static ok(data: any, message = 'success'): Result {
    return new Result(SUCCESS_CODE, message, data);
  }

  static fail(code: number, message: string): Result {
    return new Result(code, message);
  }

  /**
   * 分页数据结果返回
   * @param data 列表数据
   * @param pager 分页数据
   */
  static list<T>(data: T[], pager?: IPage): Result {
    return Result.ok({ records: data, pager });
  }
}
