import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(
    id: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(id);
    const refreshToken = await this.generateRefreshToken(id);

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
    return { accessToken, refreshToken };
  }

  async generateAccessToken(id: string): Promise<string> {
    const payload = { id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: parseInt(this.configService.get<string>('JWT_EXPIRES_IN')),
    });
  }

  async generateRefreshToken(id: string): Promise<string> {
    const payload = { id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      ),
    });
  }
}
