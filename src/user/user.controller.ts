import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('auth/kakao/callback')
  async kakaoCallback(@Req() req: any, @Res() res: Response) {
    res.redirect('http://localhost:3000');
  }
}
