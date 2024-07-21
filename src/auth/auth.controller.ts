import {
  Controller,
  Get,
  Header,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // 카카오 로그인 페이지 진입
  @Get('kakao-login-page')
  @Header('Content-Type', 'application/json')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    // const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_uri=${this.configService.get<string>('CODE_REDIRECT_URI')}`;
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_uri=https://api.owonie-dev.store/auth/kakao-login`;
    res.redirect(url);
  }

  // 카카오 인가 코드 처리
  @Get('kakao-login')
  @Header('Content-Type', 'application/json')
  async kakao(@Query() code: any, @Res() res: Response): Promise<any> {
    const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_url=http://localhost:5173/auth/kakao/callback&code=${code.code}`;

    const token_res = await axios.post(url);
    console.log('debug', token_res);
    const kakaoAccessToken: string = token_res.data.access_token;
    const userInfo = await this.getInfo(kakaoAccessToken);

    const { accessToken, refreshToken } = await this.authService.login(
      userInfo.data.id,
      userInfo.data.properties.nickname,
      userInfo.data.properties.profile_image,
    );

    res.setHeader('Set-Cookie', [
      `access_token=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Domain=.owonie-dev.store;`,
      `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Domain=.owonie-dev.store;`,
    ]);
    res.redirect('http://localhost:5173');
  }

  @Get('get-kakao-info')
  @Header('Content-Type', 'application/json')
  async getInfo(accessToken: string): Promise<any> {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const userInfo = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return userInfo;
  }

  generateAccessToken(id: string) {
    return this.authService.generateAccessToken(id);
  }

  generateRefreshToken(id: string) {
    return this.authService.generateRefreshToken(id);
  }

  @Get('test')
  @UseGuards(JwtAccessTokenGuard)
  async test(@Req() req: any) {
    console.log('test', req, this.configService.get<string>('JWT_SECRET'));
    return { message: 'This is useGuard test' };
  }
}
