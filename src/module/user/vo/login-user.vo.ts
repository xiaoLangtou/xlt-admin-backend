import { ApiProperty } from '@nestjs/swagger';

interface UserInterface {
  id: number;

  username: string;

  email: string;

  nickname: string;

  roles?: any[];

  permissions?: any[];

  headPic: string;

  phoneNum: string;

  createTime: Date;

  isFrozen?: string;

  isAdmin?: string;
}

export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInterface;
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
