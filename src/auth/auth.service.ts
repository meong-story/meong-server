import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async login(
    kakaoId: string,
    name: string,
    imageUrl: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(kakaoId);
    const refreshToken = await this.generateRefreshToken(kakaoId);
    let user = await this.userService.findOneById(kakaoId);
    if (!user) {
      user = this.usersRepository.create({
        kakaoId,
        name,
        imageUrl,
        refreshToken,
      });
      await this.usersRepository.save(user);
    } else {
      user.refreshToken = refreshToken;
      user.imageUrl = imageUrl;
      user.name = name;
      await this.usersRepository.save(user);
    }
    return { accessToken, refreshToken };
  }

  async generateAccessToken(kakaoId: string): Promise<string> {
    const payload = { kakaoId };

    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      });
    } catch (error) {
      // 에러 처리: 로그를 남기거나, 적절한 예외를 던집니다.
      console.error('Error generating access token:', error);
      throw new InternalServerErrorException('Error generating access token');
    }
  }

  async generateRefreshToken(kakaoId: string): Promise<string> {
    const payload = { kakaoId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }
}
