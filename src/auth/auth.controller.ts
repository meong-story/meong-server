import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // 카카오 로그인 진입
  @Get('kakao-login-page')
  @Header('Content-Type', 'application/json')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_uri=${this.configService.get<string>('CODE_REDIRECT_URI')}`;
    res.redirect(url);
  }

  @Get('kakao-login')
  @Header('Content-Type', 'application/json')
  async kakao(@Query() code: any, @Res() res: Response): Promise<any> {
    const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_url=http://localhost:5173/&code=${code.code}`;
    const token_res = await axios.post(url);
    const kakaoAccessToken: string = token_res.data.access_token;
    const userInfo = await this.getInfo(kakaoAccessToken);

    const { accessToken, refreshToken } = await this.authService.login(
      userInfo.id,
    );

    res.cookie('access_token', accessToken, { httpOnly: true });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.redirect('http://localhost:5173/');
    return userInfo;
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
}
