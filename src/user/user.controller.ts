import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDTO } from './dto/user-response.dto';

@Controller('user')
@ApiTags('유저 API')
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiOperation({
    summary: '유저 정보 데이터 요청',
    description: '액세스 토큰을 받아 유저 정보 데이터를 조회하고 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '유저 정보 데이터를 불러옵니다.',
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAccessTokenGuard)
  async getUserInfo(@Req() req, @Res() res: Response) {
    const user = await this.userService.findOneById(req.id);
    return res.json({
      message: 'Valid user data.',
      data: user,
    });
  }
}
