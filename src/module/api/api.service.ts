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
import { ApiIgnore } from '@/module/api/entities/api-ignore.entity';
import { CreateApiDto, IgnoreApiDto, UpdateApiDto } from '@/module/api/dto/create-api.dto';

@Injectable()
export class ApiService {
  @Inject(AxiosService)
  private readonly axiosService: AxiosService;

  @InjectRepository(Api)
  private readonly apiRepository: Repository<Api>;

  @InjectRepository(ApiIgnore)
  private readonly apiIgnoreRepository: Repository<ApiIgnore>;

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
    // 列出所有不需要鉴权的接口
    const noAuthApiResult = await to(this.apiIgnoreRepository.find());
    if (!noAuthApiResult.ok) return Result.fail(QUERY_ERROR_CODE, '同步失败');

    // 过滤出apiList于dbApiResult.value的差集
    const apiListDiff = apiList.filter(item => ![...dbNoDelApis, ...noAuthApiResult.value].find(dbItem => dbItem.method === item.method && dbItem.path === item.path));


    // 列出所有api分组
    const apiGroups = this.swaggerSyncService.getApiTags() ?? [];


    return Result.ok({
      newApis: apiListDiff,
      deleteApis: dbDeleteApis,
      ignoreApis: noAuthApiResult.value,
      apiGroups: apiGroups,
    });
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


  /**
   * 创建api
   * @param {CreateApiDto} apiDto 接口参数
   * @param {string} apiDto.path 接口路径
   * @param {string} apiDto.method 接口方法
   * @param {string} apiDto.tags 接口分组
   * @param {string} apiDto.description 接口描述
   * @param {string} apiDto.apiGroup 接口分组
   * @returns
   */
  async createApi(apiDto: CreateApiDto) {
    const { path, method, tags, description } = apiDto;

    if (!path || !method || !tags) return Result.fail(QUERY_ERROR_CODE, '参数错误');

    const apiItem = new Api();
    apiItem.method = method;
    apiItem.path = path;
    apiItem.apiGroup = tags;
    apiItem.description = description;

    const createResult = await to(this.apiRepository.save(apiItem));
    if (!createResult.ok) return Result.fail(QUERY_ERROR_CODE, '创建失败');
    return Result.ok('创建成功');
  }


  /**
   * 更新api
   * @param {UpdateApiDto} apiDto 接口参数
   * @param {string} apiDto.id 接口id
   * @param {string} apiDto.path 接口路径
   * @param {string} apiDto.method 接口方法
   * @param {string} apiDto.tags 接口分组
   * @param {string} apiDto.description 接口描述
   * @returns
   */
  async updateApi(apiDto: UpdateApiDto) {
    const { id, path, method, tags, description } = apiDto;

    if (!id || !path || !method || !tags) return Result.fail(QUERY_ERROR_CODE, '参数错误');

    const result = await to(this.apiRepository.findOneBy({ id: id, delFlag: '0' }));

    if (!result.ok) return Result.fail(QUERY_ERROR_CODE, '查询失败');
    const { value: apiItem } = result;
    if (!apiItem) return Result.fail(QUERY_ERROR_CODE, 'api不存在');

    apiItem.path = path;
    apiItem.method = method;
    apiItem.apiGroup = tags;
    apiItem.description = description;
    const updateResult = await to(this.apiRepository.save(apiItem));

    if (!updateResult.ok) return Result.fail(QUERY_ERROR_CODE, '更新失败');
    return Result.ok('更新成功');
  }


  /**
   * 忽略api
   * @param {CreateApiDto} apiDto 接口参数
   * @param {string} apiDto.path 接口路径
   * @param {string} apiDto.method 接口方法
   * @param {string} apiDto.tags 接口分组
   * @param {string} apiDto.description 接口描述
   * @returns
   */
  async ignoreApi(apiDto: IgnoreApiDto) {

    const { path, method, description, ignore } = apiDto;
    if (!path || !method) return Result.fail(QUERY_ERROR_CODE, '参数错误');

    // 判断是否已经忽略
    const apiItemResult = await this.apiIgnoreRepository.findOne({
      where: {
        path: path,
        method: method,
        delFlag: '0',
      },
    });

    if (ignore == 1) {
      if (apiItemResult) return Result.ok('api已忽略');
      const apiItem = new ApiIgnore();
      apiItem.method = method;
      apiItem.path = path;
      apiItem.description = description;
      const createResult = await to(this.apiIgnoreRepository.save(apiItem));
      if (!createResult.ok) return Result.fail(QUERY_ERROR_CODE, '忽略失败');
      return Result.ok('api已忽略');
    } else {
      const removeResult = await to(this.apiIgnoreRepository.remove(apiItemResult));
      if (!removeResult.ok) return Result.fail(QUERY_ERROR_CODE, '取消忽略失败');
      return Result.ok('忽略已取消');
    }
  }


  async batchApis(apis: CreateApiDto[]) {
    let _apis = [];
    for (const api of apis) {
      const { path, method, tags, description } = api;
      const apiItem = new Api();
      apiItem.method = method;
      apiItem.path = path;
      apiItem.apiGroup = tags;
      apiItem.description = description;
      _apis.push(apiItem);
    }
    const createResult = await to(this.apiRepository.createQueryBuilder()
      .insert()
      .into(Api)
      .values(_apis)
      .orUpdate(['method', 'path', 'api_group', 'description'], ['method', 'path'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute());

    if (!createResult.ok) return Result.fail(QUERY_ERROR_CODE, '批量创建失败');
    return Result.ok('批量创建成功');
  }

}
