import { Injectable } from '@nestjs/common';
import { Result } from '@/common/utils/result';
import {
  CreateDictDataDto,
  CreateDictDto,
} from '@/module/dict/dto/create-dict.dto';
import { Repository } from 'typeorm';
import { Dict } from '@/module/dict/entities/dict.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DictData } from '@/module/dict/entities/dict-data.entity';
import {
  UpdateDictDataDto,
  UpdateDictDto,
} from '@/module/dict/dto/update-dict.dto';
import {
  CREATE_TIME_FORMAT,
  QUERY_ERROR_CODE,
  UPDATE_TIME_FORMAT,
} from '@/common/constant';
import { getPagination } from '@/common/utils/utils';

@Injectable()
export class DictService {
  @InjectRepository(Dict)
  private readonly dictTypeRepository: Repository<Dict>;

  @InjectRepository(DictData)
  private readonly dictDataRepository: Repository<DictData>;

  /**
   * 添加字典
   * @param dictType
   * @param username
   */
  async createDictType(
    dictType: CreateDictDto,
    username: string,
  ): Promise<Result> {
    const dictItem = await this.dictTypeRepository.findOneBy({
      dictCode: dictType.dictCode,
      delFlag: '0',
    });
    console.log(dictItem, 'dictItem');

    if (dictItem) {
      return Result.fail(QUERY_ERROR_CODE, '字典编码已存在');
    }
    const dict = new Dict();
    dict.dictName = dictType.dictName;
    dict.dictCode = dictType.dictCode;
    dict.dictDesc = dictType.dictDesc;
    dict.systemFlag = dictType.systemFlag;
    dict.createBy = username;
    dict.updateBy = username;

    try {
      await this.dictTypeRepository.save(dict);
      return Result.ok('添加成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '添加失败');
    }
  }

  /**
   * 更新字典
   * @param dict
   * @param username
   */
  async updateDictType(dict: UpdateDictDto, username: string): Promise<Result> {
    const dictItem = await this.dictTypeRepository.findOneBy({
      id: dict.id,
    });

    if (!dictItem) {
      return Result.fail(QUERY_ERROR_CODE, '字典不存在');
    }

    dictItem.dictName = dict.dictName;
    dictItem.dictDesc = dict.dictDesc;
    dictItem.systemFlag = dict.systemFlag;
    dictItem.updateBy = username;

    try {
      await this.dictTypeRepository.save(dictItem);
      return Result.ok('更新成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '更新失败');
    }
  }

  /**
   * 删除字典
   * @param id
   */
  async deleteDictType(id: number): Promise<Result> {
    const dictItem = await this.dictTypeRepository.findOneBy({
      id,
    });

    if (!dictItem) {
      return Result.fail(QUERY_ERROR_CODE, '字典不存在');
    }

    try {
      await this.dictTypeRepository.save({ ...dictItem, delFlag: '1' });
      return Result.ok('删除成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '删除失败');
    }
  }

  /**
   * 查询字典列表
   */
  async findDictTypeList(dictName: string): Promise<Result> {
    const entity = this.dictTypeRepository.createQueryBuilder('dict');
    entity.select([
      'dict.id as id',
      'dict.dict_name as dictName',
      'dict.dict_code as dictCode',
      'dict.dict_desc as dictDesc',
      'dict.system_flag as systemFlag',
      'dict.create_by as createBy',
      'dict.update_by as updateBy',
      UPDATE_TIME_FORMAT('dict'),
      CREATE_TIME_FORMAT('dict'),
    ]);
    entity.where('dict.del_flag = :delFlag', { delFlag: '0' });

    if (dictName) {
      entity.andWhere('dict.dict_name like :dictName', {
        dictName: `%${dictName}%`,
      });
      entity.orWhere('dict.dict_code like :dictCode', {
        dictCode: `%${dictName}%`,
      });
    }
    const dictList = await entity.getRawMany();

    return Result.ok(dictList);
  }

  /**
   * 查询字典详情
   * @param id
   */
  async findDictTypeById(id: number): Promise<Result> {
    const dictItem = await this.dictTypeRepository.findOneBy({
      id,
      delFlag: '0',
    });
    return Result.ok(dictItem);
  }

  /**
   * 添加字典数据
   * @param dictData
   * @param username
   */
  async addDictData(
    dictData: CreateDictDataDto,
    username: string,
  ): Promise<Result> {
    // 先查询字典类型是否存在
    const dictType = await this.dictTypeRepository.findOneBy({
      id: dictData.dictTypeId,
      delFlag: '0',
    });

    if (!dictType) {
      return Result.fail(QUERY_ERROR_CODE, '字典类型不存在');
    }

    try {
      const dictDataItem = new DictData();
      dictDataItem.dictValue = dictData.dictValue;
      dictDataItem.dictLabel = dictData.dictLabel;
      dictDataItem.dictRemark = dictData.dictRemark;
      dictDataItem.dictSort = dictData.dictSort;
      dictDataItem.dictTypeId = dictData.dictTypeId;
      dictDataItem.dictDesc = dictData.dictDesc;
      dictDataItem.dictType = dictType.dictCode;
      dictDataItem.createBy = username;
      dictDataItem.updateBy = username;

      await this.dictDataRepository.save(dictDataItem);

      return Result.ok('添加成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '添加失败');
    }
  }

  /**
   * 更新字典数据
   * @param dictData
   * @param username
   */
  async updateDictData(
    dictData: UpdateDictDataDto,
    username: string,
  ): Promise<Result> {
    const dictDataItem = await this.dictDataRepository.findOneBy({
      id: dictData.id,
    });

    if (!dictDataItem) {
      return Result.fail(QUERY_ERROR_CODE, '字典数据不存在');
    }

    dictDataItem.dictValue = dictData.dictValue;
    dictDataItem.dictLabel = dictData.dictLabel;
    dictDataItem.dictRemark = dictData.dictRemark;
    dictDataItem.dictSort = dictData.dictSort;
    dictDataItem.updateBy = username;

    try {
      await this.dictDataRepository.save(dictDataItem);
      return Result.ok('更新成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '更新失败');
    }
  }

  /**
   * 删除字典数据
   * @param id
   * @param username
   */
  async deleteDictData(id: number, username: string): Promise<Result> {
    const dictDataItem = await this.dictDataRepository.findOneBy({
      id,
    });

    if (!dictDataItem) {
      return Result.fail(QUERY_ERROR_CODE, '字典数据不存在');
    }

    try {
      await this.dictDataRepository.save({
        ...dictDataItem,
        delFlag: '1',
        updateBy: username,
      });
      return Result.ok('删除成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '删除失败');
    }
  }

  /**
   * 查询字典数据列表
   * @param dictTypeId
   * @param current
   * @param size
   */
  async findDictDataList(
    dictTypeId: number,
    current: number,
    size: number,
  ): Promise<Result> {
    const dictDataCount = await this.dictDataRepository.count({
      where: {
        dictTypeId,
        delFlag: '0',
      },
    });

    const pageInfo = getPagination(dictDataCount, current, size);

    const entity = this.dictDataRepository.createQueryBuilder('dictData');
    entity.select([
      'dictData.id as id',
      'dictData.dict_value as dictValue',
      'dictData.dict_label as dictLabel',
      'dictData.dict_type as dictType',
      'dictData.dict_remark as dictRemark',
      'dictData.dict_sort as dictSort',
      'dictData.create_by as createBy',
      CREATE_TIME_FORMAT('dictData'),
    ]);
    entity.where('dictData.del_flag = :delFlag', { delFlag: '0' });
    entity.andWhere('dictData.dict_type_id = :dictTypeId', {
      dictTypeId,
    });
    const dictDataList = await entity
      .skip(pageInfo.startRow)
      .take(pageInfo.pageInfo.pageSize)
      .getRawMany();
    return Result.ok({
      records: dictDataList,
      pager: { ...pageInfo.pageInfo },
    });
  }

  /**
   * 查询字典数据详情
   * @param id
   */
  async findDictDataDetailById(id: number): Promise<Result> {
    const dictDataItem = await this.dictDataRepository.findOneBy({
      id: id,
      delFlag: '0',
    });

    return Result.ok(dictDataItem);
  }

  /**
   * @description 根据字典类型查询字典数据
   * @param type
   */
  async findDictDataDetailByType(type: string): Promise<any> {
    const dictDataList = await this.dictDataRepository.find({
      where: {
        dictType: type,
        delFlag: '0',
      },
    });

    return Result.ok(dictDataList);
  }

  /**
   * @description 根据字典类型查询字典数据并转化成对象 {dictLabel: dictValue}
   * @param type
   */
  async findDictDataAsObjectByType(type: string): Promise<Result> {
    const dictDataList = await this.dictDataRepository.find({
      where: {
        dictType: type,
        delFlag: '0',
      },
    });

    const dictDataObject = dictDataList.reduce((acc, item) => {
      acc[item.dictValue] = item.dictLabel;
      return acc;
    }, {});

    return Result.ok(dictDataObject);
  }
}
