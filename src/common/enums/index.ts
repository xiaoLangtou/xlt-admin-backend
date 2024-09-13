// Date: 2021-03-24
/**
 * 用户是否冻结 枚举 NORMAL：正常 FROZEN：冻结
 */
export enum USER_IS_FROZEN {
  NORMAL = 'NORMAL',
  FROZEN = 'FROZEN',
}

/**
 * 用户是否管理员 枚举 NO：否 YES：是
 */
export enum USER_IS_ADMIN {
  NO = 'NO',
  YES = 'YES',
}

/**
 * 验证码类型 枚举 REGISTER：注册 UPDATE：修改
 */
export enum CAPTCHA_TYPE {
  REGISTER = 'REGISTER',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  UPDATE_INFO = 'UPDATE_INFO',
}

/**
 * 删除标识 枚举 NORMAL：正常 DELETE：删除
 */
export enum DEL_FLAG {
  NORMAL = 0,
  DELETE = 1,
}

/**
 * 系统标识 枚举 SYSTEM：系统 BUSINESS：业务
 */
export enum DICT_SYSTEM_FLAG {
  SYSTEM = 'SYSTEM',
  BUSINESS = 'BUSINESS',
}

/**
 * 状态标识 枚举 ENABLE：启用 DISABLE：禁用
 */
export enum STATUS_ENUM {
  ENABLE = 1,
  DISABLE = 0,
}

/**
 * 部门类型 枚举 COMPANY：公司 DEPT：部门 GROUP：小组
 */
export enum DEPT_TYPE {
  COMPANY = 'COMPANY',
  DEPT = 'DEPT',
  GROUP = 'GROUP',
}

/**
 * 性别 枚举 1：男 2：女 3：未知
 */
export enum SEX_ENUM {
  MAN = 1,
  WOMAN = 2,
  UNKNOWN = 3,
}
