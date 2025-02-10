import { Inject, Injectable } from '@nestjs/common';
import { AxiosService } from '@/module/axios/axios.service';
import { Result } from '@/common/utils/result';
import { QUERY_ERROR_CODE } from '@/common/constant';
import { Repository } from 'typeorm';
import { Api } from '@/module/api/entities/api.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryApiDto } from '@/module/api/dto/query-api.dto';
import { to } from '@/common/utils/error-handler';
import { getPagination } from '@/common/utils/utils';
import { SwaggerSyncService } from '@/module/swagger-sync/swagger-sync.service';

@Injectable()
export class ApiService {
  @Inject(AxiosService)
  private readonly axiosService: AxiosService;

  @InjectRepository(Api)
  private readonly apiRepository: Repository<Api>;

  @Inject(SwaggerSyncService)
  private readonly swaggerSyncService: SwaggerSyncService;

  async synchronousApi() {
    // 获取所有的apis接口
    const apiList = this.swaggerSyncService.getApiList();

    // 获取数据表中所有的接口数据
    const dbApiResult = await to(this.apiRepository.find());
    if (!dbApiResult.ok) return Result.fail(QUERY_ERROR_CODE, '同步失败');

    // 过滤数据表中所有删除的接口数据
    const dbDeleteApis = dbApiResult.value.filter(item => item.delFlag == '1');
    const dbNoDelApis = dbApiResult.value.filter(item => item.delFlag == '0');

    // 过滤出apiList于dbApiResult.value的差集
    const apiListDiff = apiList.filter(item => !dbNoDelApis.find(dbItem => dbItem.method === item.method && dbItem.path === item.path && dbItem.apiGroup === item.apiGroup));

    // 列出所有被忽略的接口数据
  }

  /**
   * 批量将数据插入数据库
   * @param apiList
   */
  async batchInsertApi(apiList: Api[]) {
    try {
      if (!apiList || apiList.length === 0) return Result.ok('无数据可同步');
      const query = this.apiRepository.createQueryBuilder('api');
      await query.insert().into(Api).values(apiList).orIgnore().execute();
      return Result.ok('同步成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '同步失败');
    }
  }


  /**
   * 获取api列表
   *
   */
  async getApiList(query: QueryApiDto) {
    const { current = 1, size = 10, ...otherParams } = query;

    const queryBuilder = this.apiRepository.createQueryBuilder('api');

    queryBuilder.where('api.del_flag = :delFlag', { delFlag: '0' });

    queryBuilder.select([
      'api.id as id',
      'api.path as path',
      'api.description as description',
      'api.method as method',
      'api.api_group as apiGroup',
    ]);

    if (otherParams.path) {
      queryBuilder.andWhere('api.path like :path', { path: `%${otherParams.path}%` });
    }
    if (otherParams.method) {
      queryBuilder.andWhere('api.method in :methods', { methods: otherParams.method.split(',') });
    }

    if (otherParams.tags) {
      queryBuilder.andWhere('api.api_group in :apiGroup', { apiGroup: otherParams.tags.split(',') });
    }

    const countResult = await to(queryBuilder.getCount());
    if (!countResult.ok) return Result.fail(QUERY_ERROR_CODE, '查询失败');

    const pager = getPagination(countResult.value, +current, +size);

    const listResult = await to(queryBuilder.offset(pager.startRow).limit(pager.pageInfo.pageSize).orderBy('api.create_time', 'DESC').getRawMany());

    if (!listResult.ok) return Result.fail(QUERY_ERROR_CODE, '查询失败');

    return Result.list<Api>(listResult.value, pager.pageInfo);

  }

  /**
   * 获取api详情
   */
  async getApiDetail(id: number) {

    if (!id) return Result.fail(QUERY_ERROR_CODE, '参数错误');

    const apiDetailResult = await to(this.apiRepository.findOne({
        where: {
          id: id,
        },
      }),
    );

    if (!apiDetailResult.ok) return Result.fail(QUERY_ERROR_CODE, '查询失败');
    return Result.ok(apiDetailResult.value);

  }

  /**
   * 删除api
   */
  async deleteApi(id: number) {
    if (!id) return Result.fail(QUERY_ERROR_CODE, '参数错误');

    const apiDetailResult = await to(this.apiRepository.findOne({
        where: {
          id: id,
          delFlag: '0',
        },
      }),
    );
    if (!apiDetailResult.ok) return Result.fail(QUERY_ERROR_CODE, '查询失败');
    if (!apiDetailResult.value) return Result.fail(QUERY_ERROR_CODE, 'api不存在');
    await to(this.apiRepository.update(id, { delFlag: '1' }));
    return Result.ok('删除成功');
  }


  /**
   * 获取api分组
   */
  async getApiGroup() {

    const apiGroupResult = await to(
      this.apiRepository.createQueryBuilder('api')
        .select(['api.api_group as api_group'])
        .where('api.del_flag = :delFlag', { delFlag: '0' })
        .andWhere('api.api_group is not null')
        .groupBy('api.api_group')
        .getRawMany(),
    );
    if (!apiGroupResult.ok) return Result.fail(QUERY_ERROR_CODE, '查询失败');
    return Result.ok(apiGroupResult.value);

  }
}
