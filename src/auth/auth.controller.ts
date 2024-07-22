import {
  Controller,
  Get,
  Header,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { JwtRefreshTokenGuard } from './guard/refreshToken.guard';

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
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_uri=${this.configService.get<string>('CODE_REDIRECT_URI')}`;
    res.redirect(url);
  }

  // 카카오 인가 코드 처리
  @Get('kakao-login')
  @Header('Content-Type', 'application/json')
  async kakao(@Query('code') code: any, @Res() res: Response): Promise<any> {
    const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.configService.get<string>('KAKAO_API_KEY')}&redirect_uri=${this.configService.get<string>('CODE_REDIRECT_URI')}&code=${code}`;

    const token_res = await axios.post(url);
    console.log('debug', token_res);
    const kakaoAccessToken: string = token_res.data.access_token;
    const userInfo = await this.getInfo(kakaoAccessToken);

    const { accessToken, refreshToken } = await this.authService.login(
      userInfo.data.id,
      userInfo.data.properties.nickname,
      userInfo.data.properties.profile_image,
    );
    const refresh_token_expires_in = 60 * 60 * 24 * 30;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      // domain: '.owonie-dev.store',
      maxAge: refresh_token_expires_in * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      //domain: '.owonie-dev.store',
      maxAge: refresh_token_expires_in * 1000,
    });
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

  @Get('refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async getRefreshToken(@Req() req, @Res() res: Response) {
    const id = req.id;

    const newAccessToken = await this.authService.generateAccessToken(id);
    const newRefreshToken = await this.authService.generateRefreshToken(id);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Refresh token is valid',
      accessToken: newAccessToken,
    });
  }
}
