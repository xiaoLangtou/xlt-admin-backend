export interface IPage {
  current: number;
  lastPage: number;
  nextPage: number;
  pageSize: number;
  totalPage: number;
  total: number;
  start?: number;
}

export class Pager {
  /**
   * 当前页
   */
  current: number;

  /**
   * 上一页
   */
  lastPage: number;

  /**
   * 下一页
   */
  nextPage: number;

  /**
   * 每页显示条数
   */
  pageSize: number;

  /**
   * 总页数
   */
  totalPage: number;

  /**
   * 起始位置
   */
  start: number;

  /**
   * 总条数
   */
  total: number;

  constructor(current: number, pageSize: number, total: number) {
    this.current = current ? current : 1;
    this.pageSize = pageSize;
    this.total = total;
    this.totalPage = Math.ceil(total / pageSize);

    this.lastPage = this.current === 1 ? 1 : this.current - 1;

    this.nextPage =
      this.current < this.totalPage ? this.current + 1 : this.totalPage;

    this.start = (this.current - 1) * this.pageSize;
  }

  getStartRow(): number {
    return this.start;
  }

  getPageInfo(): IPage {
    return {
      current: this.current,
      lastPage: this.lastPage,
      nextPage: this.nextPage,
      pageSize: this.pageSize,
      totalPage: this.totalPage,
      total: this.total,
    };
  }
}
