import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Menu } from '@/module/menu/entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { arrayToTree } from '@/common/utils/utils';
import { Result } from '@/common/utils/result';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from '@/module/menu/dto/update-menu.dto';
import { CREATE_TIME_FORMAT, QUERY_ERROR_CODE } from '@/common/constant';
import { RoleService } from '@/module/role/role.service';

@Injectable()
export class MenuService {
  @InjectRepository(Menu)
  private readonly menuRepository: Repository<Menu>;

  @Inject(RoleService)
  private readonly roleService: RoleService;

  /**
   * @description 创建菜单
   * @param menu
   * @param username
   */
  async createMenuItem(menu: CreateMenuDto, username: string) {
    const menuEntity = new Menu();
    this.setCommonMenuProperties(menuEntity, menu, username);
    menuEntity.createBy = username;

    try {
      await this.menuRepository.save(menuEntity);
      return Result.ok('添加成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '添加失败');
    }
  }

  /**
   * @description 更新菜单
   * @param menu
   * @param username
   */
  async updateMenuItem(menu: UpdateMenuDto, username: string) {
    const menuEntity = await this.menuRepository.findOne({
      where: {
        id: menu.id,
        delFlag: '0',
      },
    });
    if (!menuEntity) {
      return Result.fail(QUERY_ERROR_CODE, '菜单不存在');
    }

    this.setCommonMenuProperties(menuEntity, menu, username);

    try {
      await this.menuRepository.save(menuEntity);
      return Result.ok('更新成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '更新失败');
    }
  }

  /**
   * @description 删除菜单
   * @param id
   * @param username
   */
  async deleteMenuItem(id: number, username: string) {
    const menuEntity = await this.menuRepository.findOne({
      where: {
        id,
        delFlag: '0',
      },
    });
    if (!menuEntity) {
      return Result.fail(QUERY_ERROR_CODE, '菜单不存在');
    }

    // 判断当前菜单是否有子菜单
    const childrenCount = await this.menuRepository.count({
      where: {
        parentMenuId: id,
        delFlag: '0',
      },
    });
    if (childrenCount > 0) {
      return Result.fail(QUERY_ERROR_CODE, '该菜单下存在子菜单，无法删除');
    }

    try {
      await this.menuRepository.save({
        ...menuEntity,
        delFlag: '1',
        updateBy: username,
      });
      return Result.ok('删除成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '删除失败');
    }
  }

  /**
   * @description 获取菜单详情
   * @param id
   */
  async getMenuItemDetail(id: number) {
    const menuEntity = await this.menuRepository.findOne({
      where: {
        id,
        delFlag: '0',
      },
    });
    if (!menuEntity) {
      return Result.fail(QUERY_ERROR_CODE, '菜单不存在');
    }

    return Result.ok(menuEntity);
  }

  /**
   * @description 获取当前用户菜单列表
   */
  async getUserMenuList(roles: any[]) {
    // todo 获取用户角色
    const rolesIds = roles.map((item) => item.id);
    const menuIds = await this.roleService.getMenusByRoleIds(rolesIds);
    const menuList = await this.menuRepository.find({
      select: [
        'id',
        'name',
        'enName',
        'path',
        'icon',
        'keepAlive',
        'visible',
        'embedded',
        'parentMenuId',
        'sortOrder',
        'permission',
        'menuType',
        'component',
      ],
      where: {
        delFlag: '0',
        menuType: In([0, 1]),
        id: In(menuIds),
      },
      order: {
        sortOrder: 'ASC',
      },
    });
    if (menuList.length <= 0) {
      return Result.fail(QUERY_ERROR_CODE, '暂无菜单数据,请联系管理员');
    }

    // 检查是否所有数据都没有父节点
    let menuTree = menuList;
    const allNoParentNode = menuList.every((menu) => menu.parentMenuId != -1);
    if (!allNoParentNode) {
      menuTree = arrayToTree(
        menuList.map((item) => {
          return { ...item, parentId: item.parentMenuId };
        }),
        -1,
      );
    }
    this.addMetaProperties(menuTree);
    return Result.ok(menuTree);
  }

  /**
   * @description 获取菜单树
   */
  async getMenuTreeList(name?: string) {
    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    queryBuilder.select([
      'id',
      'name',
      'en_name as enName',
      'path',
      'icon',
      'keep_alive as keepAlive',
      'visible',
      'embedded',
      'parent_menu_id as parentId',
      'sort_order as sortOrder',
      'permission',
      'menu_type as menuType',
      'component',
      CREATE_TIME_FORMAT('menu'),
    ]);

    queryBuilder.where('menu.delFlag = :delFlag', { delFlag: '0' });

    if (name) {
      queryBuilder.andWhere('menu.name like :name', { name: `%${name}%` });
    }

    queryBuilder.orderBy('menu.sortOrder', 'ASC');
    const menuList = await queryBuilder.getRawMany();

    const menuTree = arrayToTree(menuList, -1);
    return Result.ok(menuTree);
  }

  private setCommonMenuProperties(
    menuEntity: Menu,
    menu: CreateMenuDto | UpdateMenuDto,
    username: string,
  ) {
    menuEntity.menuType = menu.menuType;
    menuEntity.name = menu.name;
    menuEntity.enName = menu.enName;
    menuEntity.path = menu.menuType !== 2 ? menu.path : '';
    menuEntity.parentMenuId = menu.parentId;
    menuEntity.permission = menu.permission;
    menuEntity.component = menu.menuType == 1 ? menu.component : '';
    if ([0, 1].includes(menu.menuType)) {
      menuEntity.icon = menu.icon;
      menuEntity.keepAlive = menu.isKeepAlive ? '1' : '0';
      menuEntity.isIframe = menu.isIframe ? '1' : '0';
      menuEntity.visible = menu.isHide ? '1' : '0';
    }
    menuEntity.sortOrder = menu.sortOrder;
    menuEntity.updateBy = username;
  }

  private addMetaProperties(menus: any[]): void {
    menus.forEach((menu) => {
      menu.meta = {
        icon: menu.icon,
        isKeepAlive: menu.keepAlive === '1',
        isHide: menu.visible === '1',
        isAffix: menu.embedded === '1',
        isIframe: menu.path && menu.path.startsWith('http'),
        iframeUrl: menu.isIframe === '1' ? menu.path : '',
        requiresAuth: true,
        hideInMenu: false,
        title: menu.name,
      };

      menu.name = menu.enName;
      //删除无用属性
      delete menu.icon;
      delete menu.keepAlive;
      delete menu.visible;
      delete menu.embedded;
      delete menu.enName;

      if (menu.children && menu.children.length > 0) {
        this.addMetaProperties(menu.children);
      }
    });
  }
}
