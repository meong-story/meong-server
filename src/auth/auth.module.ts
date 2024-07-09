import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessTokenGuard } from './guard/accessToken.guard';
import { JwtAccessTokenStrategy } from './strategies/accessToken.strategy';
import { JwtRefreshTokenGuard } from './guard/refreshToken.guard';
import { JwtRefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, PassportModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    UserService,
    KakaoStrategy,
    JwtAccessTokenGuard,
    JwtAccessTokenStrategy,
    JwtRefreshTokenGuard,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AppModule {}
