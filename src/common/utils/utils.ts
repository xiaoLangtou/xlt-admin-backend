import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';
import * as Lodash from 'lodash';
import { Pager } from '@/common/utils/pager';

export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}

/**
 * 数组去重
 * @param list
 * @returns
 */
export function Uniq(list: Array<number | string>) {
  return Lodash.uniq(list);
}

export function getPagination(count: number, current: number, pageSize: number) {
  const pager = new Pager(current, pageSize, count);

  return {
    pageInfo: pager.getPageInfo(),
    startRow: pager.getStartRow(),
  };
}


export function arrayToTree<T extends { id: any; parentId: any }>(
  items: T[],
  rootId: number = -1,
): T[] {
  if (!items || items.length === 0) return [];
  if (items.length === 1 && (items[0].parentId === rootId || items[0].parentId === -1)) {
    return [items[0]];
  }

  const map = new Map<number, T & { children?: T[] }>();
  const roots: T[] = [];

  // 初始化映射，先复制对象以避免修改原数组
  items.forEach((item) => map.set(item.id, { ...item }));

  // 构建树形结构
  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId === rootId) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
    }
  });

  return roots;
}
