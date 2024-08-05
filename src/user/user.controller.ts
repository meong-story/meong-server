import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(JwtAccessTokenGuard)
  async getUserInfo(@Req() req, @Res() res: Response) {
    const user = await this.userService.findOneById(req.id);
    return res.json({
      message: 'Valid User',
      data: user,
    });
  }
}
