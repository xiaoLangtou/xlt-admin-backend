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

export function getPagination(
  count: number,
  current: number,
  pageSize: number,
) {
  const pager = new Pager(current, pageSize, count);

  return {
    pageInfo: pager.getPageInfo(),
    startRow: pager.getStartRow(),
  };
}

export function arrayToTree<
  T extends { id: any; parentId: any; children?: T[] },
>(items: T[], rootId: number = -1): T[] {
  if (!items || items.length <= 0) return [];
  if (items.length <= 1) {
    // 处理数组只有一个元素的情况，如果它没有父元素或者父元素匹配rootId，则返回它
    return items.length === 1 &&
      (items[0].parentId == rootId || items[0].parentId === -1)
      ? [{ ...items[0], children: [] }]
      : [];
  }

  const map = new Map<number, T>();
  const roots: T[] = [];

  // Step 1: 用所有节点初始化映射。
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });
  console.log(map, 'map');
  // Step 2: 构建树形结构。
  items.forEach((item) => {
    const node = map.get(item.id);
    if (item.parentId == rootId) {
      roots.push(node!); //如果parentId匹配rootId，它就是根节点
    } else {
      const parent = map.get(item.parentId!);
      if (parent) {
        parent.children!.push(node!); // 将节点作为子节点添加到其父节点
      }
    }
  });
  return roots;
}
