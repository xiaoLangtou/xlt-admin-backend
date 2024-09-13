import { Injectable } from '@nestjs/common';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { In, Like, Repository } from 'typeorm';
import { Dept } from '@/module/dept/entities/dept.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '@/common/utils/result';
import { arrayToTree } from '@/common/utils/utils';
import { QueryDeptDto } from '@/module/dept/dto/query-dept.dto';
import { CREATE_TIME_FORMAT, QUERY_ERROR_CODE } from '@/common/constant';

@Injectable()
export class DeptService {
  @InjectRepository(Dept)
  private readonly deptRepository: Repository<Dept>;

  /**
   * 创建部门
   * @param createDeptDto
   * @param username
   */
  async create(createDeptDto: CreateDeptDto, username: string) {
    const deptItem = new Dept();
    this.setDeptProperties(deptItem, createDeptDto, username);
    deptItem.createBy = username;

    if (deptItem.parentId && deptItem.parentId != -1) {
      const parentDept = await this.deptRepository.findOne({
        where: { id: deptItem.parentId },
      });
      if (!parentDept) {
        return Result.fail(QUERY_ERROR_CODE, '父级部门不存在');
      }
    }

    try {
      console.log(username, 'deptItem');
      await this.deptRepository.save(deptItem);
      return Result.ok('创建成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '创建失败');
    }
  }

  /**
   * 更新部门
   * @param updateDeptDto
   * @param username
   */
  async update(updateDeptDto: UpdateDeptDto, username: string) {
    try {
      const deptItem = await this.deptRepository.findOneBy({
        id: updateDeptDto.id,
      });
      if (!deptItem) {
        return Result.fail(QUERY_ERROR_CODE, '部门不存在');
      }

      if (deptItem.parentId && deptItem.parentId != -1) {
        const parentDept = await this.deptRepository.findOne({
          where: { id: deptItem.parentId },
        });
        if (!parentDept) {
          return Result.fail(QUERY_ERROR_CODE, '父级部门不存在');
        }
      }

      this.setDeptProperties(deptItem, updateDeptDto, username);
      await this.deptRepository.save(deptItem);
      return Result.ok('更新成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '更新失败');
    }
  }

  /**
   * 删除部门
   * @param id
   * @param username
   */
  async remove(id: number, username: string) {
    try {
      if (!id) {
        return Result.fail(QUERY_ERROR_CODE, '参数错误');
      }
      const deptItem = await this.deptRepository.findOne({ where: { id } });
      if (!deptItem) {
        return Result.fail(QUERY_ERROR_CODE, '部门不存在');
      }
      await this.deptRepository.save({ delFlag: '1', id, updateBy: username });
      return Result.ok('删除成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '删除失败');
    }
  }

  /**
   * 查询部门列表
   * @param query
   */
  async findAll(query: QueryDeptDto) {
    const { name, code, status, pid } = query;

    const queryBuilder = this.deptRepository.createQueryBuilder('dept');
    queryBuilder.select([
      'dept.id as id',
      'dept.dept_name as deptName',
      'dept.dept_code as deptCode',
      'dept.parent_id as parentId',
      'dept.status as status',
      'dept.full_name as fullName',
      'dept.order_num as orderNum',
      'dept.dept_type as deptType',
      'dept.leader as leader',
      CREATE_TIME_FORMAT('dept'),
      'dept.create_by as createBy',
    ]);

    if (pid) {
      queryBuilder.where('dept.id = :id OR dept.parentId = :pid', {
        id: Number(pid),
        pid: Number(pid),
      });
    }
    if (name) {
      queryBuilder.andWhere('dept.deptName LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.andWhere('dept.deptCode LIKE :code', { code: `%${code}%` });
    }
    if (status) {
      queryBuilder.andWhere('dept.status = :status', { status });
    }
    queryBuilder.andWhere('dept.delFlag = :delFlag', { delFlag: '0' });

    try {
      let list = await queryBuilder
        .orderBy('dept.orderNum', 'DESC')
        .getRawMany();

      if (pid) {
        const ids = list
          .filter((item) => item.id != pid)
          .map((item) => item.id);
        const childrenList = await this.deptRepository.find({
          where: {
            parentId: In(ids),
            delFlag: '0',
            ...(name && { deptName: Like(`%${name}%`) }),
            ...(code && { deptCode: Like(`%${code}%`) }),
            ...(status && { status }),
          },
        });
        list = [...list, ...childrenList];
      }

      // 去重
      const uniqueList = Array.from(new Set(list.map((item) => item.id))).map(
        (id) => list.find((item) => item.id === id),
      );

      // 当前pid是否存在子节点
      const isChildren = uniqueList.some((item) => item.parentId == pid);

      const treeList = pid
        ? [
            {
              ...uniqueList.find((item) => item.id == pid),
              children: isChildren ? arrayToTree(uniqueList, pid) : [],
            },
          ]
        : arrayToTree(uniqueList);

      return Result.ok({ records: treeList });
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '查询失败');
    }
  }

  /**
   * 获取部门树
   */
  async findDeptTree() {
    try {
      const list = await this.deptRepository.find({
        select: ['id', 'deptName', 'deptCode', 'parentId'],
        where: { delFlag: '0' },
      });

      const treeList = list.length >= 0 ? arrayToTree<Dept>(list, -1) : [];
      return Result.ok(treeList);
    } catch (e) {
      console.log(e);
      return Result.fail(QUERY_ERROR_CODE, '查询失败');
    }
  }

  /**
   * 修改部门状态
   * @param id
   * @param status
   * @param username
   */
  async changeDeptStatus(id: number, status: number, username: string) {
    try {
      const deptItem = await this.deptRepository.findOne({
        where: {
          id: id,
          delFlag: '0',
        },
      });
      if (!deptItem) {
        return Result.fail(QUERY_ERROR_CODE, '部门不存在');
      }
      deptItem.status = status;
      deptItem.updateBy = username;
      await this.deptRepository.save(deptItem);
      return Result.ok('操作成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '操作失败');
    }
  }

  /**
   * 获取部门详情
   * @param id
   */
  async findOne(id: number) {
    const queryBuilder = this.deptRepository.createQueryBuilder('dept');
    const item = await queryBuilder
      .select([
        'dept.id as id',
        'dept.deptName as deptName',
        'dept.deptCode as deptCode',
        'dept.fullName as fullName',
        'dept.deptType as deptType',
        'dept.address as address',
        'dept.email as email',
        'dept.leader as leader',
        'dept.orderNum as orderNum',
        'dept.parentId as parentId',
        'dept.phone as phone',
        'dept.postalCode as postalCode',
        'dept.remark as remark',
        'dept.status as status',
        CREATE_TIME_FORMAT('dept'),
        'dept.createBy as createBy',
      ])
      .where('dept.id = :id', { id })
      .andWhere('dept.delFlag = :flag', { flag: '0' })
      .getRawOne();
    if (!item) {
      return Result.fail(QUERY_ERROR_CODE, '部门不存在');
    }
    return Result.ok(item);
  }

  /**
   *@description 创建部门常量值: 部门代码、部门类型枚举、部门排序值
   */
  async createDeptConstant() {
    // 获取当前最大排序值
    const maxOrderNum = await this.deptRepository
      .createQueryBuilder('dept')
      .select('MAX(dept.orderNum)', 'max')
      .getRawOne();

    const orderNum = maxOrderNum && maxOrderNum.max ? maxOrderNum.max + 1 : 1;

    // 获取当前最大部门代码
    const maxCode = await this.deptRepository
      .createQueryBuilder('dept')
      .select('MAX(dept.deptCode)', 'max')
      .getRawOne();

    // 使用默认前缀
    const prefix = 'DEPT';

    // 生成新的部门代码
    const newCode =
      maxCode && maxCode.max
        ? parseInt(maxCode.max.replace(prefix, '')) + 1
        : 1;
    const deptCode = `${prefix}${newCode.toString().padStart(4, '0')}`;

    return Result.ok({ deptCode, orderNum });
  }

  /**
   * 设置部门属性
   * @param deptItem
   * @param deptDto
   * @param username
   * @private
   */
  private setDeptProperties(
    deptItem: Dept,
    deptDto: CreateDeptDto | UpdateDeptDto,
    username: string,
  ) {
    deptItem.deptName = deptDto.deptName;
    deptItem.deptCode = deptDto.deptCode;
    deptItem.fullName = deptDto.fullName;
    deptItem.deptType = deptDto.deptType;
    deptItem.address = deptDto.address;
    deptItem.email = deptDto.email;
    deptItem.leader = deptDto.leader;
    deptItem.orderNum = deptDto.orderNum;
    deptItem.parentId = deptDto.parentId ? deptDto.parentId : -1;
    deptItem.phone = deptDto.phone;
    deptItem.postalCode = deptDto.postalCode;
    deptItem.remark = deptDto.remark;
    deptItem.updateBy = username;
  }
}
