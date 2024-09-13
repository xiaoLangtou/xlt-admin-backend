import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  RequireLogin,
  RequirePermissions,
  UserInfo,
} from '@/common/decorator/custom.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from '@/module/post/dto/create-post.dto';
import { UpdatePostDto } from '@/module/post/dto/update-post.dto';
import {
  ChangeStatusDto,
  QueryPostDto,
} from '@/module/post/dto/query-post.dto';

@ApiTags('岗位管理')
@RequireLogin()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '添加岗位',
  })
  @ApiBody({
    type: CreatePostDto,
    required: true,
  })
  @RequirePermissions('admin:post:add')
  @Post('add')
  create(
    @Body() createPostDto: CreatePostDto,
    @UserInfo('username') username: string,
  ) {
    return this.postService.create(createPostDto, username);
  }

  @ApiOperation({
    summary: '更新岗位',
  })
  @ApiBody({
    type: UpdatePostDto,
    required: true,
  })
  @RequirePermissions('admin:post:edit')
  @Post('edit')
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @UserInfo('username') username: string,
  ) {
    return this.postService.update(updatePostDto, username);
  }

  @ApiOperation({ summary: '删除岗位' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '岗位ID',
  })
  @RequirePermissions('admin:post:delete')
  @Delete('remove/:id')
  deletePost(@Param('id') id: number, @UserInfo('username') username: string) {
    return this.postService.delete(id, username);
  }

  @ApiOperation({ summary: '更新岗位状态' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '岗位ID',
  })
  @ApiBody({
    type: ChangeStatusDto,
    required: true,
  })
  @RequirePermissions('admin:post:status')
  @Put('status/')
  changeStatus(
    @Body() changeStatusDto: ChangeStatusDto,
    @UserInfo('username') username: string,
  ) {
    return this.postService.changeStatus(
      changeStatusDto.id,
      changeStatusDto.status,
      username,
    );
  }

  @ApiOperation({ summary: '获取部门列表' })
  @ApiQuery({
    type: QueryPostDto,
    required: false,
  })
  @RequirePermissions('admin:post:list')
  @Get('list')
  findAll(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  @ApiOperation({ summary: '获取岗位详情' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '岗位ID',
  })
  @RequirePermissions('admin:post:detail')
  @Get('detail/:id')
  findOne(@Param('id') id: number) {
    return this.postService.findPostById(id);
  }
}
