// 日期格式
export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// 更新时间格式
export const UPDATE_TIME_FORMAT = (alias) =>
  `DATE_FORMAT(${alias}.update_time,'%Y-%m-%d %H:%i:%s') as updateTime`;

// 创建时间格式
export const CREATE_TIME_FORMAT = (alias) =>
  `DATE_FORMAT(${alias}.create_time,'%Y-%m-%d %H:%i:%s') as createTime`;

export const QUERY_ERROR_CODE = 20001;

// 排序字段
export const SORT_ORDER = 'sortOrder';
