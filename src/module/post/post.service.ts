import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '@/module/post/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from '@/module/post/dto/create-post.dto';
import { Result } from '@/common/utils/result';
import {
  CREATE_TIME_FORMAT,
  QUERY_ERROR_CODE,
  SORT_ORDER,
  UPDATE_TIME_FORMAT,
} from '@/common/constant';
import { UpdatePostDto } from '@/module/post/dto/update-post.dto';
import { QueryPostDto } from '@/module/post/dto/query-post.dto';
import { getPagination } from '@/common/utils/utils';

@Injectable()
export class PostService {
  @InjectRepository(Post)
  private readonly postRepository: Repository<Post>;

  /**
   * 创建岗位
   * @param createPostDto
   * @param username
   */
  async create(createPostDto: CreatePostDto, username: string) {
    const post = await this.postRepository.findOneBy({
      code: createPostDto.code,
    });
    if (post) {
      return Result.fail(QUERY_ERROR_CODE, '岗位编码已存在');
    }
    return this.savePost(
      createPostDto,
      username,
      '创建岗位成功',
      '创建岗位失败',
    );
  }

  /**
   * 更新岗位
   * @param postDto
   * @param username
   */
  async update(postDto: UpdatePostDto, username: string) {
    const post = await this.postRepository.findOneBy({ id: postDto.id });
    if (!post) {
      return Result.fail(QUERY_ERROR_CODE, '岗位不存在');
    }
    return this.savePost(postDto, username, '更新岗位成功', '更新岗位失败');
  }

  /**
   * 删除岗位
   * @param id
   * @param username
   */
  async delete(id: number, username: string) {
    try {
      const post = await this.postRepository.findOneBy({ id });
      if (!post) {
        return Result.fail(QUERY_ERROR_CODE, '岗位不存在');
      }

      post.delFlag = '1';
      post.deleteBy = username;
      post.deleteTime = new Date();
      await this.postRepository.save(post);

      return Result.ok('删除岗位成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '删除岗位失败');
    }
  }

  /**
   * 查询岗位
   * @param {QueryPostDto} query
   * @returns {Promise<Result>}
   */
  async findAll(query: QueryPostDto) {
    const { current = 1, size = 10, name, code, status } = query;
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    queryBuilder.where("post.delFlag = '0'");
    queryBuilder.select([
      'id',
      'name',
      'code',
      'sort_order as sortOrder',
      'status',
      UPDATE_TIME_FORMAT('post'),
    ]);
    if (name) {
      queryBuilder.andWhere('post.name like :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.andWhere('post.code like :code', { code: `%${code}%` });
    }
    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }
    queryBuilder.orderBy('post.sort_order', 'DESC');
    queryBuilder.addOrderBy('post.createTime', 'DESC');

    const count = await queryBuilder.getCount();

    const pager = getPagination(count, current, size);
    try {
      const data = await queryBuilder
        .skip(pager.startRow)
        .take(pager.pageInfo.pageSize)
        .getRawMany();
      return Result.ok({ records: data, pager: pager.pageInfo });
    } catch (e) {
      console.log(e);
      return Result.fail(QUERY_ERROR_CODE, '查询岗位失败');
    }
  }

  /**
   * 根据id查询岗位
   * @param id
   */
  async findPostById(id: number) {
    try {
      const queryBuilder = this.postRepository.createQueryBuilder('post');
      queryBuilder.where("post.delFlag = '0'");
      queryBuilder.select([
        'id',
        'name',
        'code',
        'sort_order as sortOrder',
        'status',
        UPDATE_TIME_FORMAT('post'),
        CREATE_TIME_FORMAT('post'),
        'create_by as createBy',
        'update_by as updateBy',
      ]);

      queryBuilder.andWhere('id=:id', { id });
      const post = await queryBuilder.getRawOne();

      if (!post) {
        return Result.fail(QUERY_ERROR_CODE, '岗位不存在');
      }
      return Result.ok(post);
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '查询岗位失败');
    }
  }

  async changeStatus(id: number, status: number, username: string) {
    try {
      const post = await this.postRepository.findOneBy({ id, delFlag: '0' });
      if (!post) {
        return Result.fail(QUERY_ERROR_CODE, '岗位不存在');
      }
      post.status = status;
      post.updateBy = username;
      await this.postRepository.save(post);
      return Result.ok('修改状态成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '修改状态失败');
    }
  }

  /**
   * 保存岗位
   * @param postDto
   * @param username
   * @param successMessage
   * @param errorMessage
   * @private
   */
  private async savePost(
    postDto: CreatePostDto | UpdatePostDto,
    username: string,
    successMessage: string,
    errorMessage: string,
  ) {
    const post = new Post();
    post.name = postDto.name;
    post.code = postDto.code;
    post.description = postDto.description;
    post.sortOrder = postDto[SORT_ORDER];
    post.status = postDto.status;
    post.updateBy = username;
    if (!('id' in postDto)) {
      post.createBy = username;
    } else {
      post.id = postDto.id;
    }
    try {
      await this.postRepository.save(post);
      return Result.ok(successMessage);
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, errorMessage);
    }
  }
}
