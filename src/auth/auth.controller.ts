import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  // @ts-expect-error @Query has no type
  async getKakaoInfo(@Query query: { code }) {
    const apikey = process.env.KAKAO_API_KEY;
    const redirectUri = process.env.CODE_REDIRECT_URI;
    await this.authService.kakaoLogin(apikey, redirectUri, query.code);
  }
  // 카카오 로그인 진입
  @Get('kakao-login-page')
  @Header('Content-Type', 'text/html')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_API_KEY}&redirect_uri=${process.env.CODE_REDIRECT_URI}`;
    res.redirect(url);
  }
}
