import { Injectable } from '@nestjs/common';
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
        name,
        imageUrl,
        kakaoId,
        refreshToken,
      });
      await this.usersRepository.save(user);
    } else {
      user.refreshToken = refreshToken;
      user.kakaoId = kakaoId;
      user.imageUrl = imageUrl;
      user.name = name;
      await this.usersRepository.save(user);
    }
    return { accessToken, refreshToken };
  }

  async generateAccessToken(kakaoId: string): Promise<string> {
    const payload = { kakaoId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  async generateRefreshToken(kakaoId: string): Promise<string> {
    const payload = { kakaoId };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }
}
