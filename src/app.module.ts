import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet/entities/pet.entity';
import { PetService } from './pet/pet.service';
import { PetController } from './pet/pet.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { VerificationPost } from './verification/entities/verificationPost.entity';
import { VerificationService } from './verification/verification.service';
import { VerificationCount } from './verification/entities/verificationCount.entity';
import { VerificationController } from './verification/verification.controller';
import { HttpModule } from '@nestjs/axios';
import { User } from './user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAccessTokenGuard } from './auth/guard/accessToken.guard';
import { JwtAccessTokenStrategy } from './auth/strategies/accessToken.strategy';
import { JwtRefreshTokenGuard } from './auth/guard/refreshToken.guard';
import { UserService } from './user/user.service';
import { PassportModule } from '@nestjs/passport';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtRefreshTokenStrategy } from './auth/strategies/refreshToken.strategy';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot(), PassportModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Pet, VerificationPost, VerificationCount, User],
        synchronize: true,
        charset: 'utf8mb4',
      }),
    }),
    TypeOrmModule.forFeature([Pet, VerificationPost, VerificationCount, User]),
  ],
  providers: [
    AppService,
    PetService,
    AuthService,
    UserService,
    VerificationService,
    JwtService,
    JwtAccessTokenGuard,
    JwtAccessTokenStrategy,
    JwtRefreshTokenGuard,
    JwtRefreshTokenStrategy,
  ],
  controllers: [
    PetController,
    AuthController,
    VerificationController,
    AppController,
    UserController,
  ],
})
export class AppModule {}
